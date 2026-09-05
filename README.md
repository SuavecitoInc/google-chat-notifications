# Google Chat Notifications

A TypeScript and Express service that receives webhook events from Netlify, Sentry, MongoDB, and NetSuite, then posts formatted notification cards to Google Chat spaces. It also handles Google Chat app events such as slash commands.

## Requirements

- Node.js and npm
- A Google Cloud project with the Google Chat API enabled
- A configured Google Chat app with access to the target spaces
- Application credentials for the Google Chat app

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Place the Google credentials used by the application in the project root:

   - `client_secrets.json`: OAuth client credentials from **Google Cloud Console > APIs & Services > Credentials**.
   - `service_account.json`: Service account JSON key from **Google Cloud Console > IAM & Admin > Service Accounts**.

   Keep these files private. They grant access to Google Cloud resources and must not be committed to source control.

3. Create a `.env` file in the project root:

   ```dotenv
   # Server
   PORT=3000

   # Google Chat request verification
   PROJECT_NUMBER=your-google-cloud-project-number

   # Inbound webhook verification
   NETLIFY_CLIENT_SECRET=replace-with-netlify-webhook-secret
   SENTRY_CLIENT_SECRET=replace-with-sentry-integration-secret
   MONGODB_SECRET=replace-with-mongodb-webhook-secret
   NETSUITE_SECRET=replace-with-netsuite-webhook-secret

   # Optional values used by example controllers
   EXAMPLE_SPACE=spaces/your-space-id
   EXAMPLE_KEY=your-incoming-webhook-key
   EXAMPLE_TOKEN=your-incoming-webhook-token
   ```

4. Add the configured Google Chat app to every Google Chat space that should receive notifications.

5. Start the development server:

   ```bash
   npm run dev
   ```

   The service listens at `http://localhost:3000` by default.

## Commands

| Command              | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `npm run dev`        | Run the TypeScript server with file watching.                        |
| `npm run build`      | Compile TypeScript, copy required JSON and view assets into `dist/`. |
| `npm start`          | Build the project and run the compiled server.                       |
| `npm run build:prod` | Compile production assets without deleting `dist/` first.            |
| `npm run start:prod` | Run the already compiled production server.                          |

## Endpoints

| Method | Path                          | Authentication                          | Description                                                              |
| ------ | ----------------------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| `GET`  | `/`                           | None                                    | Renders the service status page.                                         |
| `POST` | `/`                           | Google Chat bearer token                | Receives Google Chat app events and responds to supported commands.      |
| `GET`  | `/uptime`                     | None                                    | Returns server uptime and basic request details as JSON.                 |
| `GET`  | `/v1`                         | None                                    | Renders the service status page.                                         |
| `POST` | `/v1/test`                    | None                                    | Logs a webhook request for local testing and returns `Webhook received.` |
| `POST` | `/v1/webhook/:space/netlify`  | JWT in `x-webhook-signature`            | Sends a Netlify notification to the specified Google Chat space.         |
| `POST` | `/v1/webhook/:space/sentry`   | SHA-256 HMAC in `sentry-hook-signature` | Sends a Sentry notification to the specified Google Chat space.          |
| `POST` | `/v1/webhook/:space/mongodb`  | SHA-1 HMAC in `x-mms-signature`         | Sends a MongoDB notification to the specified Google Chat space.         |
| `POST` | `/v1/webhook/:space/netsuite` | SHA-256 HMAC in `x-chat-signature`      | Sends a NetSuite alert to the specified Google Chat space.               |

Replace `:space` with the Google Chat space ID, without the `spaces/` prefix. For example: `/v1/webhook/AAAA123/netsuite` posts to `spaces/AAAA123`.

## Webhook Verification

Each provider endpoint verifies the raw request body before the controller processes it:

| Provider | Header                  | Verification                                                       |
| -------- | ----------------------- | ------------------------------------------------------------------ |
| Netlify  | `x-webhook-signature`   | JWT signed with `NETLIFY_CLIENT_SECRET`; issuer must be `netlify`. |
| Sentry   | `sentry-hook-signature` | SHA-256 HMAC encoded as hexadecimal using `SENTRY_CLIENT_SECRET`.  |
| MongoDB  | `x-mms-signature`       | SHA-1 HMAC encoded as Base64 using `MONGODB_SECRET`.               |
| NetSuite | `x-chat-signature`      | SHA-256 HMAC encoded as hexadecimal using `NETSUITE_SECRET`.       |

Requests that fail verification receive `403 Forbidden`. Make sure the provider signs the exact raw JSON body sent to the service.

## NetSuite Alert Payload

The NetSuite endpoint validates incoming data before sending the Google Chat card. It expects this shape:

```json
{
  "source": "netsuite",
  "recordType": "salesorder",
  "recordId": "12345",
  "eventType": "created",
  "title": "Sales order created",
  "message": "Order SO-12345 was created.",
  "severity": "info",
  "url": "https://example.app.netsuite.com/app/accounting/transactions/salesord.nl?id=12345",
  "fields": [{ "label": "Customer", "value": "Example Customer" }],
  "space": "AAAA123",
  "timestamp": "2026-09-04T12:00:00.000Z"
}
```

Required fields are `recordType`, `recordId`, `eventType`, `title`, and `space`. Optional `severity` values are `info`, `success`, `warning`, and `error`. Although the payload contains `space`, the endpoint uses the `:space` URL parameter as the destination.

Invalid payloads receive `400 Bad Request`; failures while posting to Google Chat receive `502 Bad Gateway`.

The NetSuite custom module:

```typescript
/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptName Chat Alert Client
 */
import * as https from 'N/https';
import * as crypto from 'N/crypto';
import * as log from 'N/log';

const SERVER_URL = 'https://your-notifications-host.example.com';
const SPACE_ID = 'YOUR_GOOGLE_CHAT_SPACE_ID';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertField {
  label: string;
  value: string;
}

export interface SendAlertOptions {
  recordType: string;
  recordId: string | number;
  eventType: string;
  title: string;
  message?: string;
  severity?: AlertSeverity;
  url?: string;
  fields?: AlertField[];
  space?: string;
}

interface NetSuiteAlertPayload {
  source: 'netsuite';
  recordType: string;
  recordId: string | number;
  eventType: string;
  title: string;
  message?: string;
  severity: AlertSeverity;
  url?: string;
  fields?: AlertField[];
  space?: string;
  // timestamp: string;
}

function buildPayload(options: SendAlertOptions): NetSuiteAlertPayload {
  return {
    source: 'netsuite',
    recordType: options.recordType,
    recordId: options.recordId,
    eventType: options.eventType,
    title: options.title,
    message: options.message,
    severity: options.severity ?? 'info',
    url: options.url,
    fields: options.fields,
    space: options?.space ?? SPACE_ID,
    // timestamp: new Date().toISOString(),
  };
}

// Create an API Secret Key for signing the request body
// Setup > Company > Preferences > API Secrets
// Use the secrets ID below as the `secret` value in `crypto.createSecretKey`
function signBody(bodyString: string): string {
  const secretKey = crypto.createSecretKey({
    secret: 'custsecret_sp_gchat_alert_hmac', // the script ID, not a GUID
    encoding: crypto.Encoding.UTF_8,
  });

  const hmac = crypto.createHmac({
    algorithm: crypto.HashAlg.SHA256,
    key: secretKey,
  });

  hmac.update({ input: bodyString, inputEncoding: crypto.Encoding.UTF_8 });
  return hmac.digest({ outputEncoding: crypto.Encoding.HEX }) as string;
}

export function sendAlert(
  options: SendAlertOptions
): https.ClientResponse | undefined {
  const payload = buildPayload(options);
  const bodyString = JSON.stringify(payload);
  const signature = signBody(bodyString);

  const SPACE = options.space ?? SPACE_ID;

  const CHAT_ALERT_URL = `${SERVER_URL}/v1/webhook/${SPACE}/netsuite`;

  try {
    const response = https.post({
      url: CHAT_ALERT_URL,
      body: bodyString,
      headers: {
        'Content-Type': 'application/json',
        'x-chat-signature': signature,
      },
    });

    if (response.code >= 300) {
      log.error({
        title: 'Chat alert failed',
        details: `${response.code}: ${response.body}`,
      });
    }

    return response;
  } catch (e) {
    log.error({ title: 'Chat alert error', details: e as string });
    return undefined;
  }
}
```

Create a NetSuite Secret with script ID custsecret_sp_gchat_alert_hmac, and configure its matching value as NETSUITE_SECRET in the notification service. Deploy this module as a NetSuite custom module, grant consuming scripts access to its secret, and import sendAlert from the module path used in your account.

This is an example of how to use the custom chat alert module in a NetSuite Workflow Action Script. This workflow action sends a notification when a lead record reaches the workflow state where the action is configured. Update the module import path and Google Chat space configuration for your account.

```typescript
/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 * @NModuleScope public
 *
 */

import { EntryPoints } from 'N/types';
// import * as record from 'N/record';
import * as runtime from 'N/runtime';
// @ts-ignore - importing from a custom module
import { sendAlert } from '../custom-modules/chatAlertClient';

export const onAction: EntryPoints.WorkflowAction.onAction = (context) => {
  const rec = context.newRecord;

  const companyName = rec.getValue({ fieldId: 'companyname' }) as string;
  const email = rec.getValue({ fieldId: 'email' }) as string;
  const businessType = rec.getText({
    fieldId: 'category',
  }) as string;
  const leadSource = rec.getText({
    fieldId: 'custentity_sp_lead_source',
  }) as string;
  const salesRep = rec.getText({ fieldId: 'salesrep' }) as string;

  sendAlert({
    recordType: 'lead',
    recordId: rec.id as number,
    eventType: 'create',
    title: `New lead: ${companyName || 'Unnamed lead'}`,
    severity: 'info',
    url: `${runtime.accountId ? `https://${runtime.accountId}.app.netsuite.com` : ''}/app/common/entity/custjob.nl?id=${rec.id}`,
    fields: [
      { label: 'Business Type', value: businessType || '—' },
      { label: 'Email', value: email || '—' },
      { label: 'Source', value: leadSource || '—' },
      { label: 'Sales Rep', value: salesRep || 'Unassigned' },
    ],
  });

  // No return needed — this action has no Return Type configured on the deployment
};
```

## Google Chat Commands

Google Chat app events are delivered to `POST /` and must include a bearer token that verifies against the configured project number. The app currently supports the following slash command IDs:

| Command ID | Response                                                   |
| ---------- | ---------------------------------------------------------- |
| `1`        | Returns the incoming Google Chat event as a response card. |
| `2`        | Returns the server uptime.                                 |

Configure the corresponding slash-command names and IDs in the Google Chat API configuration for the app.

## Deployment Notes

- Set all environment variables and provide the required credential JSON files in the deployment environment.
- Expose the service over HTTPS so Google Chat and webhook providers can reach it.
- Configure Google Chat to send app events to the public `POST /` URL.
- Configure each provider to send webhooks to its matching `/v1/webhook/:space/<provider>` endpoint and use the same signing secret configured in `.env`.
