import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env.js';
import { AppError } from '../../errors/app-error.js';

export const checkGithubConfig = (_req: Request, _res: Response, next: NextFunction) => {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.GITHUB_CALLBACK_URL) {
    return next(new AppError('GitHub authentication is not configured on this server.', 501));
  }
  next();
};
