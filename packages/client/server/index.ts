import dotenv from 'dotenv';
dotenv.config();

import { HelmetData } from 'react-helmet';
import express, { Request as ExpressRequest } from 'express';
import path from 'path';

import fs from 'fs/promises';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import serialize from 'serialize-javascript';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 80;
const clientPath = path.join(__dirname, '..');
const isDev = process.env.NODE_ENV === 'development';
const internalApiOrigin =
  process.env.INTERNAL_SERVER_URL || 'http://server:3001';

async function createServer() {
  const app = express();

  app.use(cookieParser());
  let vite: ViteDevServer | undefined;
  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    });

    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(path.join(clientPath, 'dist/client'), { index: false })
    );
  }

  app.use('/api', express.raw({ type: '*/*' }));
  app.use('/api', async (req, res) => {
    if (isDev) {
      return res.status(502).json({ message: 'Use local API in development' });
    }

    try {
      const targetUrl = new URL(req.originalUrl, internalApiOrigin);
      const headers = new Headers();

      Object.entries(req.headers).forEach(([key, value]) => {
        if (key === 'host' || key === 'content-length') return;
        if (Array.isArray(value)) {
          headers.set(key, value.join(', '));
          return;
        }
        if (typeof value === 'string') {
          headers.set(key, value);
        }
      });

      const init: RequestInit = {
        method: req.method,
        headers,
        redirect: 'manual',
      };

      if (
        req.method !== 'GET' &&
        req.method !== 'HEAD' &&
        Buffer.isBuffer(req.body) &&
        req.body.length > 0
      ) {
        init.body = req.body;
      }

      const response = await fetch(targetUrl, init);

      res.status(response.status);
      response.headers.forEach((value, key) => {
        if (
          key === 'connection' ||
          key === 'content-encoding' ||
          key === 'transfer-encoding'
        ) {
          return;
        }
        res.setHeader(key, value);
      });

      const body = Buffer.from(await response.arrayBuffer());
      return res.end(body);
    } catch (error) {
      console.error('Client API proxy error:', error);
      return res.status(502).json({ message: 'Upstream API unavailable' });
    }
  });

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Получаем файл client/index.html который мы правили ранее
      // Создаём переменные
      let render: (req: ExpressRequest) => Promise<{
        html: string;
        initialState: unknown;
        helmet: HelmetData;
        styleTags: string;
      }>;
      let template: string;
      if (vite) {
        template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        );

        // Применяем встроенные HTML-преобразования vite и плагинов
        template = await vite.transformIndexHtml(url, template);

        // Загружаем модуль клиента, который писали выше,
        // он будет рендерить HTML-код
        render = (
          await vite.ssrLoadModule(
            path.join(clientPath, 'src/entry-server.tsx')
          )
        ).render;
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'dist/client/index.html'),
          'utf-8'
        );

        // Получаем путь до сбилдженого модуля клиента, чтобы не тащить средства сборки клиента на сервер
        const pathToServer = path.join(
          clientPath,
          'dist/server/entry-server.js'
        );

        // Импортируем этот модуль и вызываем с инишл стейтом
        render = (await import(pathToServer)).render;
      }

      // Получаем HTML-строку из JSX
      const {
        html: appHtml,
        initialState,
        helmet,
        styleTags,
      } = await render(req);

      // Заменяем комментарий на сгенерированную HTML-строку
      const html = template
        .replace('<!--ssr-styles-->', styleTags)
        .replace(
          `<!--ssr-helmet-->`,
          `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
        )
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--ssr-initial-state-->`,
          `<script>window.APP_INITIAL_STATE = ${serialize(initialState, {
            isJSON: true,
          })}</script>`
        );

      // Завершаем запрос и отдаём HTML-страницу
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`);
  });
}

createServer();
