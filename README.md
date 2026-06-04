# Production-Grade Node.js + Express + TypeScript Backend API

A production-grade, containerized Node.js boilerplate utilizing Express 5, strictly-typed TypeScript, ESLint v9 Flat Config, Prettier formatting, Vitest integration testing, Winston logging, and Github Actions CI.

---

## Features

- **Runtime & Compilation**: strictly-typed TypeScript targetting Node 20+ with ESM imports.
- **Boot Validation**: Validates all configuration environment variables using **Zod** at startup to fail-fast on configuration mistakes.
- **Robust Error Handling**: Structured operational HTTP errors (`AppError`) and global Express error catching with stack-trace leakage prevention in production.
- **Structured Logging**: Production Winston logger. Outputs human-readable colorized logs in development and structured JSON outputs in production (cloud-parser friendly).
- **Security Middlewares**: Secure headers (`helmet`), CORS mapping (`cors`), compression (`compression`), and IP rate limiting (`express-rate-limit`).
- **Modern Testing Suite**: Clean, ultra-fast integration testing with **Vitest** and **Supertest**.
- **Automated CI/CD**: Pre-configured Github Actions workflow verifying formatting, lint rules, tests, and compilation checks.
- **Docker Ready**: Multi-stage lightweight `node:20-alpine` build running as a non-root user.

---

## Directory Structure

```text
├── .github/
│   └── workflows/
│       └── ci.yml             # Github Actions CI workflow
├── dist/                      # Compiled JS output (compiled, ignored)
├── src/
│   ├── config/
│   │   └── env.ts             # Environment validator using Zod
│   ├── controllers/
│   │   └── health.controller.ts # Service sanity verification
│   ├── errors/
│   │   ├── app-error.ts       # Custom AppError class
│   │   └── error.middleware.ts# Global HTTP error handler
│   ├── middlewares/
│   │   ├── logging.middleware.ts # Performance HTTP auditor
│   │   └── rate-limiter.ts    # Rate limiting middleware
│   ├── routes/
│   │   ├── index.ts           # Route compiler
│   │   └── health.routes.ts   # Route registrations
│   ├── utils/
│   │   └── logger.ts          # Winston console & JSON configuration
│   ├── app.ts                 # Main Express settings & middleware configuration
│   └── server.ts              # Bind ports, list uncaught, and process exits
├── tests/
│   ├── integration/
│   │   └── health.test.ts     # Health and Error integration tests
│   └── setup.ts               # Test environments builder
├── Dockerfile                 # Multi-stage production container configuration
├── .dockerignore
├── .env.example
├── .env
├── eslint.config.js           # ESLint v9 flat config
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites
- Node.js (v20.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create your environment variables file (already done locally):
   ```bash
   cp .env.example .env
   ```

---

## Available Scripts

### Development
Launch local livereload watches utilizing `tsx watch`:
```bash
npm run dev
```

### Build & Start
Compile TS to JS outputs inside `dist/` and run node server:
```bash
# Compile TypeScript files
npm run build

# Start production server
npm start
```

### Code Formatting
Validate or automatically fix Prettier formatting rules:
```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format
```

### Static Analysis (Linter)
Validate code rules using ESLint v9 flat configs:
```bash
# Lint code
npm run lint

# Lint and auto-fix rules
npm run lint:fix
```

### Testing
Run ultra-fast test suites:
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Containerization

Build and run optimized Docker container environments locally:

```bash
# Build multi-stage image
docker build -t be-core-messaging-service .

# Run container
docker run -p 3000:3000 --env-file .env be-core-messaging-service
```
