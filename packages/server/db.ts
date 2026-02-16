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
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  logging: false, // или console.log в dev
  retry: {
    max: 8,
    match: [/SequelizeConnectionError/, /ECONNREFUSED/, /ETIMEDOUT/],
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
    console.log('→ PostgreSQL подключено успешно');
    return sequelize;
  } catch (err) {
    console.error('❌ Ошибка подключения к PostgreSQL:', err);
    throw err; // чтобы приложение упало, если БД недоступна
  }
}

// Экспортируем готовый экземпляр (но используем после await initializeDatabase())
export { sequelize };
