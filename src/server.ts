import { Server } from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

let server: Server;

// Capture uncaught exceptions to clean log state and fail fast
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception! Forcefully shutting down...', err);
  process.exit(1);
});

// Capture unhandled rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection! Forcefully shutting down...', reason as Error);
  process.exit(1);
});

const startServer = () => {
  server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
};

startServer();

// Handle graceful shutdowns on SIGINT / SIGTERM signals
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      logger.info('Http server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }

  // Force exit after 10s if shutdown hangs
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
