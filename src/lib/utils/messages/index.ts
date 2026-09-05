/* eslint-disable camelcase */
import { ChatMessage } from '../../types';
import { jsonPrettyPrint } from '../index.js';

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
