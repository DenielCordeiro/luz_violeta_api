/* eslint-disable import/no-extraneous-dependencies */
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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

    try {
      await mongoose.connect(uri, {
        family: 4,
        serverSelectionTimeoutMS: 10000,
      });
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log('✅ MongoDB conectado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao conectar no MongoDB:', error);
      process.exit(1);
    }
  }
  
  middlewares() {
    this.server.use(cors({
      origin: 'http://localhost:4200',
      credentials: true,
    }));
    this.server.use(cookieParser());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(morgan('dev'));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App();