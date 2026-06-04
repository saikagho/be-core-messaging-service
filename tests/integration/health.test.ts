import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Health Check API', () => {
  it('should return 200 OK with system statistics', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('uptime');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('environment', 'test');
  });

  it('should return 404 Not Found for non-existing routes', async () => {
    const response = await request(app)
      .get('/api/v1/non-existent-route')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      status: 'fail',
      message: 'Route /api/v1/non-existent-route not found',
    });
  });
});
