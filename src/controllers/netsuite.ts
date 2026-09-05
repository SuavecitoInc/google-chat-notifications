import type { Request, Response } from 'express';
import { z } from 'zod';

import { createClientWithAppCredentials } from '../lib/utils/authentication.js';
import { createNetsuiteCard } from '../lib/utils/messages/netsuite.js';

const netsuiteAlertSchema = z.object({
  source: z.literal('netsuite').default('netsuite'),
  recordType: z.string(),
  recordId: z.union([z.string(), z.number()]),
  eventType: z.string(),
  title: z.string(),
  message: z.string().optional(),
  severity: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  url: z.string().url().optional(),
  fields: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  space: z.string(),
  timestamp: z.string().datetime().optional(),
});

export const netsuiteNotification = async (req: Request, res: Response) => {
  const { space } = req.params;
  const parsed = netsuiteAlertSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const card = createNetsuiteCard(payload);

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
    return res.status(200).send('Webhook received.');
  } catch (err) {
    console.error('Failed to post NetSuite alert to Chat:', err);
    return res.status(502).json({ error: 'Failed to post to Google Chat' });
  }
};

export default netsuiteNotification;
