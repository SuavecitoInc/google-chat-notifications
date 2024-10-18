import type { Request, Response } from 'express';
import app from './app.js';
import setupRoutes from './routes/index.js';

const PORT = process.env.PORT || 3000;

setupRoutes(app);

app.use((req: Request, res: Response) => {
  res.status(404).send("Sorry can't find that!");
});

// Optional fallthrough error handler
app.use(function onError(err: Error, req: Request, res: Response) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  // @ts-expect-error
  res.end(`${res.sentry}\n`);
});

app.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
);
