import type { Request, Response } from 'express';
import { createClientWithAppCredentials } from '../lib/utils/authentication.js';
import { createMongoDBCard } from '../lib/utils/messages/mongodb.js';

export const mongodbNotification = async (req: Request, res: Response) => {
  const { space } = req.params;
  const sendPayload = req.query?.payload === 'true';
  const title = req.body?.status ? req.body?.status : 'Notification';
  const card = createMongoDBCard(title, req.body, sendPayload);

  try {
    // Create a client
    const chatClient = createClientWithAppCredentials();

    // Initialize request argument(s)
    const request = {
      parent: `spaces/${space}`,
      message: card,
    };

    // Make the request
    const response = await chatClient.createMessage(request);

    // Handle the response
    console.log(response);
    res.status(200).send('Webhook received.');
  } catch (err: any) {
    console.error('error', err);
  }
};

export default mongodbNotification;
