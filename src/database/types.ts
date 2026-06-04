import pg from 'pg';

export type TransactionClient = pg.PoolClient;

export interface PoolHealth {
  totalCount: number;
  idleCount: number;
  waitingCount: number;
  isHealthy: boolean;
}
