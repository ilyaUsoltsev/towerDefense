import path from 'path';
import { config } from 'dotenv';
import { existsSync } from 'fs';

const envPath = path.resolve(__dirname, '../../.env');
const envPathFromDist = path.resolve(__dirname, '../../../.env');
config({ path: existsSync(envPath) ? envPath : envPathFromDist });

import cors from 'cors';
import express from 'express';
import { sequelize, connectToDatabase } from './db';
import apiRoutes from './routes';
import { authMiddleware } from './middleware/auth';

const app = express();
app.use(express.json());
const clientPort = process.env.CLIENT_PORT || '3000';
app.use(
  cors({
    origin: `http://localhost:${clientPort}`,
    credentials: true,
  })
);
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
