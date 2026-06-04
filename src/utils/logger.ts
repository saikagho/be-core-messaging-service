import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

// Custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colors for each level (console only)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Log level determined by NODE_ENV
const getLogLevel = () => {
  return env.NODE_ENV === 'development' ? 'debug' : 'info';
};

// Console layout format for local development
const devFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  colorize({ all: true }),
  errors({ stack: true }),
  printf(
    (info) =>
      `[${info.timestamp}] ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`,
  ),
);

// Standard JSON output format for production (cloud-ready log parsing)
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const transports = [
  new winston.transports.Console({
    format: env.NODE_ENV === 'development' ? devFormat : prodFormat,
    silent: env.NODE_ENV === 'test',
  }),
];

export const logger = winston.createLogger({
  level: getLogLevel(),
  levels,
  transports,
  // Catch exceptions and rejections to prevent silent crashes
  exceptionHandlers: [
    new winston.transports.Console({
      format: env.NODE_ENV === 'development' ? devFormat : prodFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: env.NODE_ENV === 'development' ? devFormat : prodFormat,
    }),
  ],
});
