export type ChatMessage = {
  type: string; // 'MESSAGE'
  eventTime: string; // '2024-09-26T21:09:39.370431Z'
  message: {
    name: string; // 'spaces/-G4jXsAAAAE/messages/PdinSZ18Wwc.PdinSZ18Wwc'
    sender: {
      name: string; // 'users/1111111111111'
      displayName: string; // 'John Doe'
      avatarUrl: string;
      email: string; // 'example@domain.com'
      type: string; // 'BOT' | 'HUMAN'
      domainId: string; // '15je4ps'
    };
    createTime: string; // '2024-09-26T21:09:39.370431Z'
    text: string; // '/test'
    annotations: [
      {
        type: string; // 'SLASH_COMMAND'
        startIndex: number; // 0
        length: number; // 5
        slashCommand: {
          bot: {
            name: string; // 'users/105554045549778996362'
            displayName: string;
            avatarUrl: string;
            type: string; // 'BOT'
          };
          type: string; // 'INVOKE'
          commandName: string; // '/test'
          commandId: string; // '1'
        };
      },
    ];
    thread: {
      name: string; // 'spaces/-G4jXsAAAAE/threads/PdinSZ18Wwc'
      retentionSettings: {
        state: string; // 'PERMANENT'
      };
    };
    space: {
      name: string; // 'spaces/-G4jXsAAAAE'
      type: string; // 'DM'
      singleUserBotDm: boolean;
      spaceThreadingState: string; // 'UNTHREADED_MESSAGES'
      spaceType: string; // 'DIRECT_MESSAGE'
      spaceHistoryState: string; // 'HISTORY_ON'
      spaceUri: string; // 'https://chat.google.com/dm/-G4jXsAAAAE?cls=11'
    };
    slashCommand: {
      commandId: string; // '1'
    };
    retentionSettings: {
      state: string; // 'PERMANENT'
    };
    messageHistoryState: string; // 'HISTORY_ON'
    formattedText: string; // '/test'
  };
  user: {
    name: string; // 'users/1111111111'
    displayName: string; // 'John Doe'
    avatarUrl: string;
    email: string; // 'example@domain.com'
    type: string; // 'HUMAN'
    domainId: string; // '15je4ps'
  };
  space: {
    name: string; // 'spaces/-G4jXsAAAAE'
    type: string; // 'DM'
    singleUserBotDm: boolean;
    spaceThreadingState: string; // 'UNTHREADED_MESSAGES'
    spaceType: string; // 'DIRECT_MESSAGE'
    spaceHistoryState: string; // 'HISTORY_ON'
    spaceUri: string; // 'https://chat.google.com/dm/-G4jXsAAAAE?cls=11'
    displayName: string;
  };
  configCompleteRedirectUrl: string; //
  common: {
    userLocale: string; // 'en'
    hostApp: string; // 'CHAT'
  };
};
