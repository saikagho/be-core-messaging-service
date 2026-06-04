import pg from "pg";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { PoolHealth, TransactionClient } from "./types.js";

const { Pool } = pg;


// ─── Pool Configuration ───────────────────────────────────────────────────────

const POOL_CONFIG: pg.PoolConfig = {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,

  // Connection pool sizing
  min: env.DATABASE_POOL_MIN,
  max: env.DATABASE_POOL_MAX,

  // Timeouts
  idleTimeoutMillis: env.DATABASE_IDLE_TIMEOUT,
  connectionTimeoutMillis: env.DATABASE_CONNECTION_TIMEOUT,
  statement_timeout: env.DATABASE_STATEMENT_TIMEOUT,
  query_timeout: env.DATABASE_QUERY_TIMEOUT,

  // SSL — always enforce in production
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : env.DATABASE_SSL ? { rejectUnauthorized: false } : false,

  // Keep-alive prevents silent connection drops from firewalls / NAT
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,

  // Application name visible in pg_stat_activity for debugging
  application_name: env.APP_NAME,
};

// ─── Pool Singleton ───────────────────────────────────────────────────────────

let _pool: pg.Pool | null = null;
let _isShuttingDown = false;

function getPool(): pg.Pool {
  if (_isShuttingDown) {
    throw new Error('Database pool is shutting down — refusing new connections.');
  }
  if (!_pool) {
    _pool = createPool();
  }
  return _pool;
}

function createPool(): pg.Pool {
  const pool = new Pool(POOL_CONFIG);

  // ── Event listeners ──────────────────────────────────────────────────────

  pool.on('connect', (client: pg.PoolClient) => {
    logger.info('PostgreSQL: new client connected.', {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
    });

    // Harden each connection at the session level
    client
      .query(
        `
            SET statement_timeout         = ${POOL_CONFIG.statement_timeout};
            SET lock_timeout               = 10000;
            SET idle_in_transaction_session_timeout = ${POOL_CONFIG.idleTimeoutMillis};
            SET search_path                = public;
        `
      )
      .catch((err) =>
        logger.error('PostgreSQL: failed to apply session hardening settings.', { err })
      );
  });

  pool.on('acquire', () => {
    logger.debug('PostgreSQL: client acquired from pool.', {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    });
  });

  pool.on('remove', () => {
    logger.debug('PostgreSQL: client removed from pool.', {
      totalCount: pool.totalCount,
    });
  });

  pool.on('error', (err: Error) => {
    // Idle client errors — log but don't crash; the pool will replace the client
    logger.error('PostgreSQL: unexpected error on idle client.', { err: err.message });
  });

  return pool;
}

// ─── Query Helper ─────────────────────────────────────────────────────────────

/**
 * Execute a single parameterised query.
 *
 * Uses $1, $2 … placeholders — NEVER interpolate user input into `text`.
 *
 * @example
 * const { rows } = await db.query<User>(
 *   'SELECT * FROM users WHERE id = $1',
 *   [userId]
 * );
 */
async function query<T extends pg.QueryResultRow = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await getPool().query<T>(text, params);
    logger.debug('PostgreSQL query executed.', {
      durationMs: Date.now() - start,
      rowCount: result.rowCount,
      // Never log the raw `text` or `params` in production — they may contain PII
    });
    return result;
  } catch (err) {
    logger.error('PostgreSQL query failed.', {
      durationMs: Date.now() - start,
      err: (err as Error).message,
      code: (err as pg.DatabaseError).code,
    });
    throw err;
  }
}

// ─── Transaction Helper ───────────────────────────────────────────────────────

/**
 * Run `fn` inside a serialisable transaction.
 * Automatically commits on success and rolls back on any error.
 *
 * @example
 * const result = await db.transaction(async (tx) => {
 *   await tx.query('INSERT INTO orders …', [...]);
 *   await tx.query('UPDATE inventory …', [...]);
 *   return { orderId: 42 };
 * });
 */
async function transaction<T>(fn: (client: TransactionClient) => Promise<T>): Promise<T> {
  const client = (await getPool().connect()) as TransactionClient;
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch((rollbackErr: Error) =>
      logger.error('PostgreSQL: ROLLBACK failed.', { rollbackErr: rollbackErr.message })
    );
    throw err;
  } finally {
    client.release();
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────

/**
 * Lightweight liveness probe — call from your /healthz or /readyz route.
 */
async function healthCheck(): Promise<PoolHealth> {
  const pool = getPool();
  const health: PoolHealth = {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
    isHealthy: false,
  };

  try {
    await pool.query('SELECT 1');
    health.isHealthy = true;
  } catch (err) {
    logger.error('PostgreSQL health check failed.', { err: (err as Error).message });
  }

  return health;
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

/**
 * Drain the pool before the process exits.
 * Wire this up to your SIGTERM / SIGINT handlers.
 */
async function shutdown(): Promise<void> {
  _isShuttingDown = true;
  if (_pool) {
    logger.info('PostgreSQL: draining connection pool…');
    await _pool.end();
    _pool = null;
    logger.info('PostgreSQL: pool closed.');
  }
}

// Register once — safe for tests and hot-reload because we guard with _isShuttingDown
process.once('SIGINT', () => shutdown().catch((err) => logger.error('Pool shutdown error', { err })));
process.once('SIGTERM', () => shutdown().catch((err) => logger.error('Pool shutdown error', { err })));

// ─── Public API ───────────────────────────────────────────────────────────────

export const db = {
  /** Execute a parameterised SQL statement. */
  query,
  /** Run a callback inside a transaction — auto-commits or rolls back. */
  transaction,
  /** Ping the database; use in health/readiness probes. */
  healthCheck,
  /** Drain the pool on shutdown. */
  shutdown,
  /** Direct pool access when you need low-level control (rare). */
  get pool() {
    return getPool();
  },
} as const;