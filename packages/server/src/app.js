import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import createRoutes from './routes';

export default async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(await createRoutes());

  return app;
};
