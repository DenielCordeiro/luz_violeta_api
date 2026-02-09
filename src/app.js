/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes.js';
import EFIWebhook  from './services/efiWebhook.js';

let isConnected = false;

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.connectionDB();
  }

  async start() {
    const PORT = process.env.PORT || 3333;

    this.server.listen(PORT, async () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  }

  async connectionDB() {
    if (isConnected) return;

    try {
      const mongoURL = process.env.MONGO_URL;

      const clientOptions = {
        serverApi: {
          version: '1',
          strict: true,
          deprecationErrors: true,
        },
      };

      await mongoose.connect(mongoURL, clientOptions, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      isConnected = true;
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log('Não foi possível estabelecer conxão do backend com o MongoDB');
    }
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(morgan('dev'));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App();
