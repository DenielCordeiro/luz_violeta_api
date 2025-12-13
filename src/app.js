/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { getEfiRequest } from './apis/efi.js';

class App {
  constructor() {
    this.connectionDB();
    this.server = express();
    this.middlewares();
    this.routes();
    this.authenticateEFIBank();
  }

  async connectionDB() {
    try {
      const uri = 'mongodb+srv://luzvioleta:violeta@luzvioleta.h2xeiso.mongodb.net/luzvioleta';

      const clientOptions = {
        serverApi: {
          version: '1',
          strict: true,
          deprecationErrors: true,
        },
      };

      await mongoose.connect(uri, clientOptions, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
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

  async authenticateEFIBank() {
    try {
      const efiRequest = await getEfiRequest();
      return efiRequest;
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log('Erro ao autenticar com o banco EFI:', error.message);
    }
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
