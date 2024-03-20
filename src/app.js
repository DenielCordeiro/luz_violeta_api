import bodyparser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();

    // ip database 186.224.135.20/32
    mongoose.connect('mongodb+srv://luzvioleta:violeta@luzvioleta.h2xeiso.mongodb.net/luzvioleta', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(bodyparser.urlencoded({ extended: true }));
    this.server.use(bodyparser.json());

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads')),
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
