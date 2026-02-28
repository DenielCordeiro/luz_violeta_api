/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import routes from './routes.js';
import dotenv from 'dotenv';

dotenv.config();

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  async start() {
    await this.connectionDB();

    const PORT = process.env.PORT || 3333;

    this.server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  }

  async connectionDB() {
    const uri = process.env.MONGO_URL;
    const clientOptions = { 
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
      }
    };

    try {
      await mongoose.connect(uri, clientOptions);
      await mongoose.connection.db.admin().command({ ping: 1 });

      console.log('Banco conectado!');
      
    } catch (error) {
      console.error('Erro ao conectar no MongoDB:', error);
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
