// Set testing environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DATABASE_HOST = process.env.DATABASE_HOST ?? 'localhost';
process.env.DATABASE_PORT = process.env.DATABASE_PORT ?? '5432';
process.env.DATABASE_NAME = process.env.DATABASE_NAME ?? 'test_db';
process.env.DATABASE_USER = process.env.DATABASE_USER ?? 'test_user';
process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD ?? 'test_password';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? 'test-google-client-secret';
process.env.GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3001/api/v1/auth/google/callback';
process.env.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? 'test-github-client-id';
process.env.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? 'test-github-client-secret';
process.env.GITHUB_CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL ?? 'http://localhost:3001/api/v1/auth/github/callback';
process.env.FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID ?? 'test-facebook-client-id';
process.env.FACEBOOK_CLIENT_SECRET =
  process.env.FACEBOOK_CLIENT_SECRET ?? 'test-facebook-client-secret';
process.env.FACEBOOK_CALLBACK_URL =
  process.env.FACEBOOK_CALLBACK_URL ?? 'http://localhost:3001/api/v1/auth/facebook/callback';
