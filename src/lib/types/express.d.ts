declare namespace Express {
  interface Request {
    rawBody: string;
  }
}

declare module 'http' {
  interface IncomingMessage {
    rawBody: string;
  }
}
