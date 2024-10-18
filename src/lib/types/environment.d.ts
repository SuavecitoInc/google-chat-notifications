declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROJECT_NUMBER: string;
      SECRET_KEY: string;
      EXAMPLE_SPACE: string;
      EXAMPLE_KEY: string;
      EXAMPLE_TOKEN: string;
      NETLIFY_CLIENT_SECRET: string;
      SENTRY_CLIENT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
