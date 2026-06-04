import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';
import { loggingMiddleware } from './middlewares/logging.middleware.js';
import { rateLimiter } from './middlewares/rate-limiter.js';
import router from './routes/index.js';
import { AppError } from './errors/app-error.js';
import { globalErrorHandler } from './errors/error.middleware.js';
import passport from './config/auth.js';

const app = express();

// Initialize Passport middleware
app.use(passport.initialize());

// Secure server headers with Helmet
app.use(helmet());

// Enable Cross-Origin Resource Sharing with configured origins
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);

// Compress output response payloads
app.use(compression());

// JSON request body parser (limit to 10kb to avoid huge JSON DDoS attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Custom request logger middleware
app.use(loggingMiddleware);

// Protect endpoints from excessive request calls
app.use(rateLimiter);

// Mount central router matching configured API prefix
app.use(env.API_PREFIX, router);

// Throw formatted AppError for unmatched endpoints
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Centralized Global Error Handler
app.use(globalErrorHandler);

export default app;
