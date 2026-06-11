import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app';

describe('App Error Handler', () => {
  it('handles invalid JSON payload in request body', async () => {
    const response = await request(app)
      .post('/severity/analyze')
      .set('Content-Type', 'application/json')
      .send('{ invalidJson: true');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Internal server error');
  });
});
