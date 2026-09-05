/* eslint-disable camelcase */
import { SentryIssuePaylod } from '../../types';
import { getSentryProjectFromUrl, jsonPrettyPrint } from '../index.js';

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

export default createSentryCard;
