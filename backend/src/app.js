import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import './database/index.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import delay from 'express-delay';
import cookieParser from 'cookie-parser';

import homeRoutes from './routes/homeRoutes.js';
import avatarRoutes from './routes/avatarRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import staffRoutes from './routes/staffRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    const whiteList = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : [];

    this.app.use(cors({
      origin: function (origin, callback) {
        if (!origin || whiteList.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));

    this.app.use(cookieParser());
    this.app.use(delay(process.env.NODE_ENV === 'development' ? 500 : 0));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use('/images/', express.static(resolve(__dirname, '..', 'uploads', 'images')));
  }

  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/avatar', avatarRoutes);
    this.app.use('/users', userRoutes);
    this.app.use('/tokens', tokenRoutes);
    this.app.use('/students', studentRoutes);
    this.app.use('/staff', staffRoutes);
  }
}

export default new App().app;
