import * as crypto from 'crypto';
import type { NextFunction, Response } from 'express';
import NodeCache from 'node-cache';
import type { AuthRequest, UserData } from '../types/auth';
import { config } from './config';

const sessionCache = new NodeCache({ stdTTL: config.CACHE_TTL_SECONDS });

const createCacheKey = (cookies: string): string => {
  const hash = crypto.createHash('sha256').update(cookies).digest('hex');
  return `session:${hash}`;
};

// Проверяем сессию на бэкенде
const verifyUser = async (cookies: string): Promise<UserData> => {
  const response = await fetch(`${config.AUTH_SERVICE_URL}/api/v2/auth/user`, {
    method: 'GET',
    headers: {
      Cookie: cookies,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Invalid session');
  return (await response.json()) as UserData;
};

const DEV_MOCK_USER: UserData = {
  id: 1,
  login: 'dev-user',
  first_name: 'Dev',
  second_name: 'User',
  display_name: 'Dev User',
  avatar: '',
  phone: '',
  email: 'dev@local',
};

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.headers.cookie;

    if (!cookies) {
      if (process.env.NODE_ENV === 'development') {
        req.user = DEV_MOCK_USER;
        return next();
      }
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let userData: UserData | null = null;
    const cacheKey = createCacheKey(cookies);

    userData = sessionCache.get<UserData>(cacheKey) || null;
    if (!userData) {
      try {
        userData = await verifyUser(cookies);
        sessionCache.set(cacheKey, userData, config.CACHE_TTL_SECONDS);
      } catch {
        if (process.env.NODE_ENV === 'development') {
          req.user = DEV_MOCK_USER;
          return next();
        }
        throw new Error('Invalid session');
      }
    }

    if (!userData) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    req.user = userData;
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      error: 'User not authenticated',
    });
  }
};
