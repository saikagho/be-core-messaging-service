import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface UserPayload {
  id: string;
  email?: string;
  displayName: string;
  provider: string;
}

/**
 * Generate a stateless signed JWT token containing the user profile payload
 */
export const signToken = (payload: UserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d', // 7 days token expiration
  });
};

/**
 * Verify an incoming JWT token and extract the user payload
 */
export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, env.JWT_SECRET) as UserPayload;
};
