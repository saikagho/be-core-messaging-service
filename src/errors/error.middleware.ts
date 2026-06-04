import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendDevError = (err: any, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendProdError = (err: any, res: Response) => {
  // Operational, trusted error: send clear structured message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: protect database details/stack traces
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error via Winston
  if (err.statusCode >= 500) {
    logger.error(`[500 Internal Error] ${req.method} ${req.originalUrl}: ${err.message}`, {
      stack: err.stack,
    });
  } else {
    logger.warn(`[Operational Error] ${req.method} ${req.originalUrl}: ${err.message}`);
  }

  if (env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else {
    sendProdError(err, res);
  }
};
