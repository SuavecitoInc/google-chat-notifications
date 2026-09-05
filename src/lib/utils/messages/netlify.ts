/* eslint-disable camelcase */
import { NetlifyPayload } from '../../types';
import { buildNetlifyDeploymentUrl, jsonPrettyPrint } from '../index.js';

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

export default createNetlifyCard;
