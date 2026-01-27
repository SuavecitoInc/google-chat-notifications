/* eslint-disable no-underscore-dangle */
import express from 'express';
import type { Express, Response, Request, NextFunction } from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import favicon from 'serve-favicon';
import helmet from 'helmet';

import dotenv from 'dotenv';

// __driname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// favicon
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // Spread the default directives first
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'", 'example.com'],
      },
    },
  })
);
app.use(cors());

app.disable('x-powered-by');

// views
app.set('view engine', 'ejs'); // Or 'pug', 'hbs', etc.
app.set('views', path.join(__dirname, 'views')); // Set your views directory

app.use('/robots.txt', (req: Request, res: Response, next: NextFunction) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

export default app;
