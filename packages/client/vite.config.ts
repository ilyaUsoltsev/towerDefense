import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DEV_SERVER_URL = 'http://localhost:3001';
const PROD_PUBLIC_URL = 'https://towerdefense-56.ya-praktikum.tech';
const PROD_INTERNAL_URL = 'http://server:3001';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const externalServerUrl =
    process.env.EXTERNAL_SERVER_URL ||
    (isProd ? PROD_PUBLIC_URL : DEV_SERVER_URL);
  const internalServerUrl =
    process.env.INTERNAL_SERVER_URL ||
    (isProd ? PROD_INTERNAL_URL : DEV_SERVER_URL);

  return {
    server: {
      port: Number(process.env.CLIENT_PORT) || 3000,
    },
    define: {
      __EXTERNAL_SERVER_URL__: JSON.stringify(externalServerUrl),
      __INTERNAL_SERVER_URL__: JSON.stringify(internalServerUrl),
    },
    build: {
      outDir: path.join(__dirname, 'dist/client'),
    },
    ssr: {
      format: 'cjs',
      noExternal: ['@gravity-ui/uikit'],
    },
    plugins: [react()],
  };
});
