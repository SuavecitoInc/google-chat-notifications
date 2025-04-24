/* eslint-disable camelcase */
import {
  ChatMessage,
  MongoDBPayload,
  NetlifyPayload,
  SentryIssuePaylod,
} from '../types';
import {
  buildNetlifyDeploymentUrl,
  getSentryProjectFromUrl,
  jsonPrettyPrint,
} from './index.js';

export const exampleCard = () => {
  return {
    text:
      '👋🌎 Hello world! I created this message by calling ' +
      "the Chat API's `messages.create()` method.",
    cardsV2: [
      {
        card: {
          header: {
            title: 'About this message',
            imageUrl:
              'https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/info/default/24px.svg',
          },
          sections: [
            {
              header: 'Contents',
              widgets: [
                {
                  textParagraph: {
                    text:
                      '🔡 <b>Text</b> which can include ' +
                      'hyperlinks 🔗, emojis 😄🎉, and @mentions 🗣️.',
                  },
                },
                {
                  textParagraph: {
                    text:
                      '🖼️ A <b>card</b> to display visual elements' +
                      'and request information such as text 🔤, ' +
                      'dates and times 📅, and selections ☑️.',
                  },
                },
                {
                  textParagraph: {
                    text:
                      '👉🔘 An <b>accessory widget</b> which adds ' +
                      'a button to the bottom of a message.',
                  },
                },
              ],
            },
            {
              header: "What's next",
              collapsible: true,
              widgets: [
                {
                  textParagraph: {
                    text: "❤️ <a href='https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages.reactions/create'>Add a reaction</a>.",
                  },
                },
                {
                  textParagraph: {
                    text:
                      "🔄 <a href='https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/patch'>Update</a> " +
                      "or ❌ <a href='https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/delete'>delete</a> " +
                      'the message.',
                  },
                },
              ],
            },
          ],
        },
      },
    ],
    accessoryWidgets: [
      {
        buttonList: {
          buttons: [
            {
              text: 'View documentation',
              icon: { materialIcon: { name: 'link' } },
              onClick: {
                openLink: {
                  url: 'https://developers.google.com/workspace/chat/create-messages',
                },
              },
            },
          ],
        },
      },
    ],
  };
};

export const createTextMessage = (message: string) => {
  return {
    text: message,
  };
};

export const createResponseCard = (data: ChatMessage) => {
  const { message } = data;
  const { sender, text } = message;

  return {
    text: `Sent by ${sender.displayName}: ${text}`,
    cardsV2: [
      {
        card: {
          header: {
            title: 'Hello',
            subtitle: `Sent by ${sender.displayName}`,
            imageUrl:
              'https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/info/default/24px.svg',
          },
          sections: [
            {
              header: 'Payload',
              collapsible: true,
              widgets: [
                {
                  textParagraph: {
                    text: jsonPrettyPrint(data),
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
};

export const createSentryCard = (
  payload: SentryIssuePaylod,
  sendPayload: boolean = false
) => {
  const { event } = payload.data;
  const { title, message, url, type, web_url } = event;

  const project = getSentryProjectFromUrl(url);

  const sections = [
    {
      header: 'Project',
      collapsible: false,
      widgets: [
        {
          textParagraph: {
            text: project,
          },
        },
      ],
    },
    {
      header: 'Event ID',
      collapsible: false,
      widgets: [
        {
          textParagraph: {
            text: event.event_id,
          },
        },
      ],
    },
    {
      header: 'Contents',
      collapsible: false,
      widgets: [
        {
          textParagraph: {
            text: title,
          },
        },
      ],
    },
  ];

  if (sendPayload) {
    sections.push({
      header: 'Event',
      collapsible: true,
      widgets: [
        {
          textParagraph: {
            text: jsonPrettyPrint(event),
          },
        },
      ],
    });
  }

  return {
    text: message,
    cardsV2: [
      {
        card: {
          header: {
            title: `Sentry Alert: ${type}`,
            subtitle: 'An error occurred in your application.',
            imageUrl:
              'https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/info/default/24px.svg',
          },
          sections,
        },
      },
    ],
    accessoryWidgets: [
      {
        buttonList: {
          buttons: [
            {
              text: 'View Issue',
              icon: { materialIcon: { name: 'link' } },
              onClick: {
                openLink: {
                  url: web_url,
                },
              },
            },
          ],
        },
      },
    ],
  };
};

export const createNetlifyCard = (
  cardTitle: string,
  payload: NetlifyPayload,
  sendPayload: boolean = false
) => {
  const { state, name, error_message } = payload;

  const message = `Netflify Event: ${cardTitle.replaceAll('_', ' ')}`;

  const stateArr = [
    {
      textParagraph: {
        text: state,
      },
    },
  ];

  const hasError = state === 'error';
  if (hasError && error_message) {
    stateArr.push({
      textParagraph: {
        text: error_message,
      },
    });
  }

  const accessoryWidgetsArr = [];
  if (state !== 'deleted') {
    accessoryWidgetsArr.push({
      buttonList: {
        buttons: [
          {
            text: 'View',
            icon: { materialIcon: { name: 'link' } },
            onClick: {
              openLink: {
                url: buildNetlifyDeploymentUrl(payload),
              },
            },
          },
        ],
      },
    });
  }

  const sections = [
    {
      header: 'Project',
      collapsible: false,
      widgets: [
        {
          textParagraph: {
            text: name,
          },
        },
      ],
    },
    {
      header: 'State',
      collapsible: false,
      widgets: stateArr,
    },
  ];

  if (sendPayload) {
    sections.push({
      header: 'Event',
      collapsible: true,
      widgets: [
        {
          textParagraph: {
            text: jsonPrettyPrint(payload),
          },
        },
      ],
    });
  }

  return {
    text: message,
    cardsV2: [
      {
        card: {
          header: {
            title: message,
            imageUrl:
              'https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/info/default/24px.svg',
          },
          sections,
        },
      },
    ],
    accessoryWidgets: accessoryWidgetsArr,
  };
};

export const createMongoDBCard = (
  cardTitle: string,
  payload: MongoDBPayload,
  sendPayload: boolean = false
) => {
  const { created, id, humanReadable, updated, orgId, status } = payload;

  const message = `MongoDB: ${cardTitle.replaceAll('_', ' ')}`;

  const sections = [
    {
      header: 'Organization ID',
      collapsible: false,
      widgets: [
        {
          textParagraph: {
            text: orgId,
          },
        },
      ],
    },
    {
      header: 'Status',
      collapsible: false,
      widgets: [
        {
          textParagraph: {
            text: status,
          },
        },
      ],
    },
  ];

  if (sendPayload) {
    sections.push({
      header: 'Message',
      collapsible: true,
      widgets: [
        {
          textParagraph: {
            text: humanReadable,
          },
        },
      ],
    });
  }

  return {
    text: message,
    cardsV2: [
      {
        card: {
          header: {
            title: message,
            imageUrl:
              'https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/info/default/24px.svg',
          },
          sections,
        },
      },
    ],
  };
};
