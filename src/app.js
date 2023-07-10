import express from 'express';
// import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();

    // mongoose.connect('mongodb+srv://devhouse:devhouse@node.ydha1zq.mongodb.net/devhouse', {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });
  }

  middlewares() {
    this.server.use(cors());

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads')),
    );

    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
