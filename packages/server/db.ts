import { Sequelize } from 'sequelize';

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env;

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: POSTGRES_HOST || 'localhost',
  port: Number(POSTGRES_PORT) || 5432,
  username: required('username', POSTGRES_USER),
  password: required('password', POSTGRES_PASSWORD),
  database: POSTGRES_DB,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  retry: {
    max: 8,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeConnectionTimedOutError/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
    ],
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('→ PostgreSQL подключено успешно');
    return sequelize;
  } catch (err) {
    console.error('❌ Ошибка подключения к PostgreSQL:', err);
    throw err; // чтобы приложение упало, если БД недоступна
  }
}

function required(name: string, value?: string) {
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

// Экспортируем готовый экземпляр (но используем после await initializeDatabase())
export { sequelize };
