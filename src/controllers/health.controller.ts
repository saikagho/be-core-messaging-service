import { Request, Response } from 'express';
import { env } from '../config/env.js';

export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      memoryUsage: process.memoryUsage(),
    },
  });
};
