import request from 'supertest';
import app from '../src/index';
import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { Server, IncomingMessage, ServerResponse } from 'http';

let server: Server<typeof IncomingMessage, typeof ServerResponse>;
beforeAll(async () => {
  server = app.listen(3000);
});

describe('Test the preference routes', async () => {
  const login = await request(app).post('/auth/login').send({
    email: 'nabhan.hanif@icloud.com',
    password: 'Test123'
  });

  test('Get preferences should return 401', async () => {
    const response = await request(app).get('/preferences');
    expect(response.statusCode).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
  });

  test('Update preferences should return 401', async () => {
    const response = await request(app)
      .put('/preferences')
      .send({
        categories: [
          'business',
          'entertainment',
          'general',
          'health',
          'science',
          'sports',
          'technology'
        ]
      });
    expect(response.statusCode).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
  });

  const token = login.headers['X-Auth-Token'] as string;
  test('Get preferences should return 200', async () => {
    const response = await request(app)
      .get('/preferences')
      .set('X-Auth-Token', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  test('Update preferences should return 200', async () => {
    const response = await request(app)
      .put('/preferences')
      .send({
        categories: [
          'business',
          'entertainment',
          'general',
          'health',
          'science',
          'sports',
          'technology'
        ]
      })
      .set('X-Auth-Token', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  test('Update preferences should return 400', async () => {
    const response = await request(app)
      .put('/preferences')
      .send({
        categories: ['test']
      })
      .set('X-Auth-Token', token);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
  });
});

afterAll(async () => {
  server.close();
});
