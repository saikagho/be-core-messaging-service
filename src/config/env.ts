/* eslint-disable no-console */
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  APP_NAME: z.string().default("be-core-messaging-service"),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  JWT_SECRET: z.string().default('super-secret-jwt-key'),
  
  // Google credentials
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
  
  // Github credentials
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().optional(),
  
  // Facebook credentials
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CALLBACK_URL: z.string().optional(),
  
  // Database variables
  DATABASE_HOST: z.string().nonoptional(),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_NAME: z.string().nonoptional(),
  DATABASE_USER: z.string().nonoptional(),
  DATABASE_PASSWORD: z.string().nonoptional(),
  DATABASE_SSL: z.coerce.boolean().default(true),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(20),
  DATABASE_IDLE_TIMEOUT: z.coerce.number().default(30000),
  DATABASE_CONNECTION_TIMEOUT: z.coerce.number().default(5000),
  DATABASE_STATEMENT_TIMEOUT: z.coerce.number().default(30000),
  DATABASE_QUERY_TIMEOUT: z.coerce.number().default(30000)
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  // Use console.error during bootstrap before logger is initialized
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
