import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false, // Deprecate outdated rate limit headers
  handler: (req, res, next) => {
    next(new AppError('Too many requests, please try again later.', 429));
  },
});
