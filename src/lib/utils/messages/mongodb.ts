/* eslint-disable camelcase */
import { MongoDBPayload } from '../../types';

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

export default createMongoDBCard;
