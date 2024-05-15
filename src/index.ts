import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger, env } from './utils';
import './utils/mongo';
import Router from './routes';

const startApp = async () => {
  const app = express();
  const corsOpts = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
  };

  app.use(cors(corsOpts));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb, extended: true' }));

  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.get('/welcome', (req, res) => {
    res.send('Welcome to Vegeel User service');
  });

  app.use('/api', Router);
  app.enable('trust proxy');
  app.use(helmet());

  const port = env('APP_PORT');
  app.listen(port, async () => {
    //await client.connect();
    logger.info(`
          #################################################
          🛡️ App listening on port: ${port} 🛡️ 
          #################################################
      `);
  });
};
startApp();
