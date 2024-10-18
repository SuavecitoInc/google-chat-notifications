import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

dotenv.config();

type Source = 'netlify' | 'sentry';

type Config = {
  [key in Source]: {
    type: 'jwt' | 'digest';
    key: string;
    secret: string;
    encoding?: 'hex' | 'base64';
  };
};

const config: Config = {
  netlify: {
    type: 'jwt',
    key: 'x-webhook-signature',
    secret: process.env.NETLIFY_CLIENT_SECRET,
  },
  sentry: {
    type: 'digest',
    key: 'sentry-hook-signature',
    secret: process.env.SENTRY_CLIENT_SECRET,
    encoding: 'hex',
  },
};

function verifySignature(source: Source) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { secret, encoding = 'hex', key } = config[source];
    const signature = req.get(key);

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(req.rawBody, 'utf8') // removed hex
      .digest(encoding);
    if (hmac === signature) {
      console.log('+++++++++++++++++ REQUEST VERIFIED +++++++++++++++++>');
      next();
    } else {
      console.log('+++++++++++++++++ ERROR - FORBIDDEN +++++++++++++++++>');
      res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
    }
  };
}

function verifyJWT(source: Source) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { secret, key } = config[source];
    const webToken = req.get(key) as string;

    const decoded = jwt.verify(webToken, secret);
    if (decoded && (decoded as any)?.iss === 'netlify') {
      console.log('+++++++++++++++++ REQUEST VERIFIED +++++++++++++++++>');
      next();
    } else {
      console.log('+++++++++++++++++ ERROR - FORBIDDEN +++++++++++++++++>');
      res.status(403).json({
        success: false,
        error: 'Forbidden',
      });
    }
  };
}

export function verifyRequest(source: Source) {
  const { type } = config[source];
  if (type === 'digest') {
    return verifySignature(source);
  }
  return verifyJWT(source);
}

const GOOGLE_CHAT_PROJECT_NUMBER = process.env.PROJECT_NUMBER;

const jwksClient = new JwksClient({
  jwksUri:
    'https://www.googleapis.com/service_accounts/v1/jwk/chat@system.gserviceaccount.com',
  cache: true,
});

async function verifyChat(request: Request): Promise<boolean> {
  const prefix = 'Bearer ';
  const authHeader = request.header('Authorization') as string;
  const token = authHeader?.startsWith(prefix)
    ? authHeader.slice(prefix.length)
    : null;

  if (!token) {
    return false;
  }

  return new Promise<boolean>((resolve, reject) => {
    const getKey = (
      header: jwt.JwtHeader,
      callback: (err: Error | null, key: string) => void
    ) => {
      jwksClient.getSigningKey(header.kid, (err, key) => {
        const signingKey = key?.getPublicKey();
        if (!signingKey) {
          callback(new Error('Invalid signing key'), '');
        } else {
          callback(null, signingKey);
        }
      });
    };

    jwt.verify(
      token,
      getKey,
      {
        audience: GOOGLE_CHAT_PROJECT_NUMBER,
        issuer: 'chat@system.gserviceaccount.com',
      },
      (err: any, _decoded) => {
        if (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

export async function verifyChatRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isVerified = await verifyChat(req);

  if (!isVerified) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
    });
  }

  return next();
}

export default {};
