import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env.js';
import { AppError } from '../../errors/app-error.js';

export const checkGoogleConfig = (_req: Request, _res: Response, next: NextFunction) => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
    return next(new AppError('Google authentication is not configured on this server.', 501));
  }
  next();
};
