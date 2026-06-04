// Set testing environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DATABASE_HOST = process.env.DATABASE_HOST ?? 'localhost';
process.env.DATABASE_PORT = process.env.DATABASE_PORT ?? '5432';
process.env.DATABASE_NAME = process.env.DATABASE_NAME ?? 'test_db';
process.env.DATABASE_USER = process.env.DATABASE_USER ?? 'test_user';
process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD ?? 'test_password';
