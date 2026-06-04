import { Request, Response, NextFunction } from "express";
import { env } from '../../config/env.js';
import { AppError } from "../../errors/app-error.js";

export const checkFacebookConfig = (_req: Request, _res: Response, next: NextFunction) => {
  if (!env.FACEBOOK_CLIENT_ID || !env.FACEBOOK_CLIENT_SECRET || !env.FACEBOOK_CALLBACK_URL) {
    return next(new AppError('Facebook authentication is not configured on this server.', 501));
  }
  next();
};
