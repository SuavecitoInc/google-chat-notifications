/* eslint-disable camelcase */
import type { NetSuiteAlertPayload } from '../../types/netsuite.js';

const SEVERITY_META: Record<string, { emoji: string; color: string }> = {
  info: { emoji: '💬', color: '#4285F4' },
  success: { emoji: '✅', color: '#34A853' },
  warning: { emoji: '⚠️', color: '#FBBC04' },
  error: { emoji: '🚨', color: '#EA4335' },
};

export const createNetsuiteCard = (payload: NetSuiteAlertPayload) => {
  const meta = SEVERITY_META[payload.severity as keyof typeof SEVERITY_META];
  const widgets: Array<
    | { textParagraph: { text: string } }
    | { decoratedText: { topLabel: string; text: string } }
    | {
        buttonList: {
          buttons: Array<{
            text: string;
            onClick: { openLink: { url: string } };
          }>;
        };
      }
  > = [];

  if (payload.message) {
    widgets.push({ textParagraph: { text: payload.message } });
  }

  if (payload.fields?.length) {
    payload.fields.forEach((f) => {
      widgets.push({ decoratedText: { topLabel: f.label, text: f.value } });
    });
  }

  const card = {
    cardsV2: [
      {
        cardId: `netsuite-${payload.recordType}-${payload.recordId}-${Date.now()}`,
        card: {
          header: {
            title: `${meta.emoji} ${payload.title}`,
            subtitle: `NetSuite • ${payload.recordType} #${payload.recordId} • ${payload.eventType}`,
          },
          sections: widgets.length ? [{ widgets }] : [],
        },
      },
    ],
  };

  if (payload.url) {
    card.cardsV2[0].card.sections = card.cardsV2[0].card.sections.length
      ? card.cardsV2[0].card.sections
      : [{ widgets: [] }];
    card.cardsV2[0].card.sections[0].widgets.push({
      buttonList: {
        buttons: [
          {
            text: 'Open in NetSuite',
            onClick: { openLink: { url: payload.url } },
          },
        ],
      },
    });
  }

  return card;
};

export default createNetsuiteCard;
