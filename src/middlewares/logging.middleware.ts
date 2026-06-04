import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const userAgent = req.get('user-agent') || 'unknown';

    logger.http(`${method} ${originalUrl} ${statusCode} - ${duration}ms - UA: ${userAgent}`);
  });

  next();
};
