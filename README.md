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
| `npm test`           | Run the Jest test suite.                                             |

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
