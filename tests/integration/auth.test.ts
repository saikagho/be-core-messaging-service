import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('OAuth2 Authentication Endpoints', () => {
  it('should redirect (302) to Google OAuth portal', async () => {
    const response = await request(app).get('/api/v1/auth/google').expect(302);

    expect(response.headers.location).toContain('accounts.google.com');
  });

  it('should redirect (302) to GitHub OAuth portal', async () => {
    const response = await request(app).get('/api/v1/auth/github').expect(302);

    expect(response.headers.location).toContain('github.com/login/oauth');
  });

  it('should redirect (302) to Facebook OAuth portal', async () => {
    const response = await request(app).get('/api/v1/auth/facebook').expect(302);

    expect(response.headers.location).toContain('facebook.com');
  });
});
