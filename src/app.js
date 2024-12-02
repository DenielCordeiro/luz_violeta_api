/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';

class App {
  constructor() {
    this.connectionDB();
    this.server = express();
    this.middlewares();
    this.routes();
  }

  async connectionDB() {
    const uri = 'mongodb+srv://luzvioleta:violeta@luzvioleta.h2xeiso.mongodb.net/luzvioleta';
    const clientOptions = {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
    };

    try {
      await mongoose.connect(uri, clientOptions, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (erro) {
      /* eslint-disable-next-line no-console */
      console.log(erro);
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

export default new App().server;
