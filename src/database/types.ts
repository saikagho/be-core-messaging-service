import pg from "pg";

export interface QueryResult<T extends pg.QueryResultRow = Record<string, unknown>> extends pg.QueryResult<T> {}

export type TransactionClient = pg.PoolClient;

export interface PoolHealth {
  totalCount: number;
  idleCount: number;
  waitingCount: number;
  isHealthy: boolean;
}