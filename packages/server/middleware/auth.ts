import { NextFunction, Response } from 'express';
import NodeCache from 'node-cache';
import { AuthRequest, UserData } from '../types/auth';
import { config } from './config';

const sessionCache = new NodeCache({ stdTTL: config.CACHE_TTL_SECONDS });

// Проверяем сессию на бэкенде
const verifyUser = async (): Promise<UserData> => {
  const response = await fetch(`${config.AUTH_SERVICE_URL}/api/v2/auth/user`);

  if (!response.ok) throw new Error('Invalid session');
  return (await response.json()) as UserData;
};

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;

    if (!cookies || !cookies.authCookie) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let userData: UserData | null = null;
    let cacheKey: string | null = null;

    cacheKey = `session:${cookies.uuid}`;
    userData = sessionCache.get(cacheKey) || null;
    if (!userData) {
      userData = await verifyUser();
      sessionCache.set(cacheKey, userData, config.CACHE_TTL_SECONDS);
    }

    if (!userData) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    req.user = userData;
    return next();
  } catch (error) {
    return res.status(401).json({
      error: error ? JSON.stringify(error) : 'User not authenticated',
    });
  }
};
