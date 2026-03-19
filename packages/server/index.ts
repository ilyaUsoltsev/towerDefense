import path from 'path';
import { config } from 'dotenv';
import { existsSync } from 'fs';

const envPath = path.resolve(__dirname, '../../.env');
const envPathFromDist = path.resolve(__dirname, '../../../.env');
config({ path: existsSync(envPath) ? envPath : envPathFromDist });
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import cors from 'cors';
import express from 'express';
import { sequelize, connectToDatabase } from './db';
import apiRoutes from './routes';
import themeRoutes from './routes/theme';
import { authMiddleware, optionalAuthMiddleware } from './middleware/auth';

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const defaultClientOrigin = isProd
  ? process.env.PROD_CLIENT_ORIGIN || 'https://towerdefense-56.ya-praktikum.tech'
  : `http://localhost:${process.env.CLIENT_PORT || 3000}`;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || defaultClientOrigin,
    credentials: true,
  })
);
app.use('/api', optionalAuthMiddleware, themeRoutes);
app.use('/api', authMiddleware, apiRoutes);

const PORT = Number(process.env.SERVER_PORT) || 3001;

(async () => {
  try {
    await connectToDatabase();
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false, alter: true });
    } else {
      await sequelize.sync({ force: false, alter: false });
    }
    app.listen(PORT, () => {
      console.log(`  ➜ 🎸 Server запущен на порту: ${PORT}`);
    });
  } catch (err) {
    console.error('Не удалось запустить сервер из-за проблем с БД: ', err);
    process.exit(1);
  }
})();
