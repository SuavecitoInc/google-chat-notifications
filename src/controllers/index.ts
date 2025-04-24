import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createClientWithAppCredentials } from '../lib/utils/authentication.js';
import {
  createNetlifyCard,
  createResponseCard,
  createSentryCard,
  exampleCard,
} from '../lib/utils/messages.js';
import type { ChatMessage } from '../lib/types/chat.js';
import { createMongoDBCard, format } from '../lib/utils/index.js';

dotenv.config();

const SPACE = process.env.EXAMPLE_SPACE;
const KEY = process.env.EXAMPLE_KEY;
const TOKEN = process.env.EXAMPLE_TOKEN;

export const helloFriend = (req: Request, res: Response) => {
  res.status(200).send('Hello, friend...');
};

export const respond = async (req: Request, res: Response) => {
  console.log('someone pinged @ or /');
  const data = req.body as ChatMessage;

  let message = {
    text: 'Hello, friend...',
  };

  if (data.type === 'ADDED_TO_SPACE' && data.space.type === 'ROOM') {
    message.text = `Thanks for adding me to ${data?.space?.displayName || 'the space'}`;
  } else if (data.type === 'ADDED_TO_SPACE' && data.space.type === 'DM') {
    message.text = `Thanks for adding me to a DM, ${data.user.displayName}`;
  } else if (
    data.type === 'MESSAGE' &&
    data.message.slashCommand &&
    data.message.slashCommand?.commandId
  ) {
    if (data.message.slashCommand.commandId === '1') {
      message = createResponseCard(data);
    }
    if (data.message.slashCommand.commandId === '2') {
      message.text = `Uptime: ${format(process.uptime())}`;
    }
  }

  return res.json(message);
};

export const webhook = (req: Request, res: Response) => {
  // get header
  console.log('HEADERS', req.headers);
  console.log('BODY', req.body);
  res.status(200).send('Webhook received.');
};

export const netlifyNotification = async (req: Request, res: Response) => {
  const { space } = req.params;
  const sendPayload = req.query?.payload === 'true';

  const title = req.get('x-netlify-event') || '';
  const card = createNetlifyCard(title, req.body, sendPayload);

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
    console.log('error', err);
  }
};

export const sentryIssueNotification = async (req: Request, res: Response) => {
  const { space } = req.params;
  const sendPayload = req.query?.payload === 'true';

  const card = createSentryCard(req.body, sendPayload);

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
    console.log('error', err);
  }
};

export const defaultChat = async (req: Request, res: Response) => {
  const message = exampleCard();
  const webhookUrl = `'https://chat.googleapis.com/v1/spaces/${SPACE}/messages?key=${KEY}&token=${TOKEN}';`;
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(message),
  });
  const responseJson = response.json();
  res.status(200).send(responseJson);
};

export const authenticatedChatMessage = async (req: Request, res: Response) => {
  const card = exampleCard();
  try {
    // Create a client
    const chatClient = createClientWithAppCredentials();

    // Initialize request argument(s)
    const request = {
      parent: `spaces/${SPACE}`,
      message: card,
    };

    // Make the request
    const response = await chatClient.createMessage(request);

    // Handle the response
    console.log(response);
    res.status(200).send(response);
  } catch (err: any) {
    console.log('error', err);
  }
};

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
    console.log('error', err);
  }
};
