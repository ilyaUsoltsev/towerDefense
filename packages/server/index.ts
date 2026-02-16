import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { sequelize, connectToDatabase } from './db';
import apiRoutes from './routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = Number(process.env.SERVER_PORT) || 3001;

(async () => {
  try {
    await connectToDatabase();
    await sequelize.sync({ force: false, alter: true });

    app.listen(PORT, () => {
      console.log(`  ➜ 🎸 Server запущен на порту: ${PORT}`);
    });
  } catch (err) {
    console.error('Не удалось запустить сервер из-за проблем с БД');
    process.exit(1);
  }
})();

app.get('/friends', (_, res) => {
  res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ]);
});

app.get('/user', (_, res) => {
  res.json({ name: 'Степа', secondName: 'Степанов' });
});

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});
