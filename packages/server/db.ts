import { Client } from 'pg';

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createClientAndConnect = async (
  maxRetries = 5,
  retryDelay = 3000
): Promise<Client | null> => {
  const config = {
    user: POSTGRES_USER,
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: Number(POSTGRES_PORT),
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = new Client(config);
      await client.connect();

      const res = await client.query('SELECT NOW()');
      console.log('  ➜ 🎸 Connected to the database at:', res?.rows?.[0].now);
      client.end();

      return client;
    } catch (e) {
      console.error(
        `Database connection attempt ${attempt}/${maxRetries} failed:`,
        (e as Error).message
      );

      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000}s...`);
        await sleep(retryDelay);
      } else {
        console.error('Max retries reached. Could not connect to database.');
        console.error(e);
      }
    }
  }

  return null;
};
