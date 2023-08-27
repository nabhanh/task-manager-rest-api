import request from 'supertest';
import app from '../src/index';
import { test, expect } from 'vitest';
import { faker } from '@faker-js/faker/locale/en_IN';

test('Register should return 201', async () => {
  const response = await request(app).post('/auth/register').send({
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName()
  });
  expect(response.statusCode).toBe(201);
  expect(response.body).toBeInstanceOf(Object);
});

test('Register should return 400', async () => {
  const response = await request(app).post('/auth/register').send({
    email: faker.internet.email(),
    password: faker.internet.password()
  });
  expect(response.statusCode).toBe(400);
  expect(response.body).toBeInstanceOf(Object);
});
