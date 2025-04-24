import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import { verifyRequest, verifyChatRequest } from '../middleware.js';
import {
  helloFriend,
  // authenticatedChatMessage,
  // defaultChat,
  netlifyNotification,
  respond,
  sentryIssueNotification,
  mongodbNotification,
  webhook,
} from '../controllers/index.js';
import { format } from '../lib/utils/index.js';

const routes = (app: Express) => {
  app.get('/', helloFriend);

  app.post('/', verifyChatRequest, respond);

  app.get('/uptime', (req: Request, res: Response) =>
    res.status(200).send({
      uptime: format(process.uptime()),
      message: 'Ok',
      date: new Date(),
      ip: req.ip,
    })
  );

  const apiV1Router = express.Router();

  apiV1Router.get('/', helloFriend);

  // testing / viewing payload
  apiV1Router.post('/test', webhook);

  // example chat routes
  // apiV1Router.post('/chat/test', defaultChat);
  // apiV1Router.post('/chat/auth', authenticatedChatMessage);

  apiV1Router.post(
    '/webhook/:space/netlify',
    verifyRequest('netlify'),
    netlifyNotification
  );

  apiV1Router.post(
    '/webhook/:space/sentry',
    verifyRequest('sentry'),
    sentryIssueNotification
  );

  apiV1Router.post(
    '/webhook/:space/mongodb',
    verifyRequest('mongodb'),
    mongodbNotification
  );

  app.use('/v1', apiV1Router);
};

export default routes;
