import express from 'express';
import type { Express, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Calling the express.json() method for parsing
app.use(
  express.json({
    limit: '50mb',
    verify: (req: Request, _res: Response, buf: Buffer) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());

app.disable('x-powered-by');

app.use('/robots.txt', (req: Request, res: Response, next: NextFunction) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

export default app;
