# Google Chat Notifications

> Google Chat Bot / Webhook Notifications Server

### Setup

---

Google Authentication:

Step 1: Create a Google Cloud Project

1.  Go to Google Cloud Console:

    - Visit Google Cloud Console.

2.  Create a New Project:

    - Click on the project dropdown in the top navigation bar.
    - Click on "New Project".
    - Enter a project name and select an organization if applicable.
    - Click "Create".

Step 2: Enable Google Chat API

1.  Navigate to the API Library:

    - In the left sidebar, go to "APIs & Services" > "Library".

2.  Search for Google Chat API:

    - In the search bar, type "Google Chat API".
    - Click on "Google Chat API" from the search results.

3.  Enable the API:

    - Click the "Enable" button.

Step 3: Create a Service Account

1.  Go to Service Accounts:

    - In the left sidebar, navigate to "APIs & Services" > "Credentials".

2.  Create a Service Account:

    - Click on "Create Credentials" and select "Service account".

3.  Fill in Service Account Details:

    - Enter a name and description for the service account.
    - Click "Create".

4.  Grant Service Account Permissions (Optional):

    - Assign roles as needed. For Google Chat API, typically you might need roles like Chat Bot or Editor.
    - Click "Continue".

5.  Skip the Key Creation Step:

    - Click "Done" to finish creating the service account.

Step 4: Create and Download Keys

1.  Open Service Account Details:

    - Find the newly created service account in the list and click on it.

2.  Add Key:

    - Go to the "Keys" tab.
    - Click on "Add Key" and choose "JSON".

3.  Download the Key:

    - A JSON file will be automatically downloaded. This file contains your credentials, so keep it secure.

Step 5: Configure the API

1.  Set Up OAuth Consent Screen:

    - Go to "APIs & Services" > "OAuth consent screen".
    - Configure the consent screen as required (for internal or external use).
    - Fill out the necessary fields, then save.

2.  Use Service Account in Your Application:

    - Integrate the service account credentials in your application using the downloaded JSON key. Libraries are available for various programming languages to facilitate this.

Step 6: Test the Google Chat API

1.  Make API Calls:

    - Use tools like Postman or your application code to make API calls to Google Chat using the service account credentials.

2.  Send a Test Message:

    - Ensure your service account has the necessary permissions to interact with the Google Chat API and send messages.

Additional Tips

- Secure Your JSON Key: Keep your service account key secure; do not share it publicly.
- Review Quotas and Billing: Monitor your project for API usage and ensure you’re aware of any billing implications.
- Explore Documentation: Check the Google Chat API documentation for further details and code examples.

---

Google Authentication files required:

- client_secrets.json
  - Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client IDs
- service_account.json
  - Google Cloud Console > IAM & Admin > Service Accounts > Keys

---

Google Spaces:

- Create a Google Space in Google Chat to send the notifications to. the app must be added into the space with `@Suavecito`

---

Environmental Variables:

```bash
# used for gchat verification
PROJECT_NUMBER=
# used for examle routes / controllers
EXAMPLE_SPACE=
EXAMPLE_KEY=
EXAMPLE_TOKEN=
# used to validate requests
SENTRY_CLIENT_SECRET= # get this by creating an internal integration
NETLIFY_CLIENT_SECRET= # generate this secret yourself and add to all notifications in netlify

```

---

### Routes

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/v1/webhook/:space/netlify</td>
      <td>Sends a Google Chat Notification Card with the Netlify Deployment / Event information. This route accepts a query param of payload=true, to send the payload in the message.</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/v1/webhook/:space/sentry</td>
      <td>Sends a Google Chat Notification Card with the Sentry Issue / Event information. This route accepts a query param of payload=true, to send the payload in the message</td>
    </tr>
  </tbody>
</table>

### App / Bot

> The app / bot can be added into a space by using the `@Suavecito` command.

Slash Commands:

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/hello</td>
      <td>This command returns the message payload as a card message.</td>
    </tr>
    <tr>
      <td>/uptime</td>
      <td>This command returns the server's uptime in HH:MM:SS.</td>
    </tr>
  </tbody>
</table>
