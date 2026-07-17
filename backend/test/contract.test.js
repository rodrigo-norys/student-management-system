import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';

import { setupTestData, teardownTestData, testUser } from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

beforeAll(async () => {
  await setupTestData();
});

afterAll(async () => {
  await teardownTestData();
  await connection.close();
});

// O envelope é `{ errors: [...] }` em toda a API. O front lê essa chave; quem
// divergir tem as mensagens engolidas no lugar de exibidas.
describe('contrato — envelope de erro é { errors: [] } em toda a API', () => {
  it('validateRequest devolve errors no plural', async () => {
    const gd = testUser(LEVELS.GENERAL_DIRECTOR);
    const res = await request(app)
      .put('/users/setup-password')
      .set('Cookie', cookieFor(gd))
      .send({ password: 'fraca' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
    expect(res.body.error).toBeUndefined();
  });

  it.each([
    ['/staff/999999', LEVELS.SCHOOL_OFFICE],
    ['/guardians/999999', LEVELS.SCHOOL_OFFICE],
    ['/users/999999', LEVELS.SCHOOL_OFFICE],
    ['/students/999999', LEVELS.SCHOOL_OFFICE],
  ])('404 de %s usa errors no plural', async (path, level) => {
    const res = await request(app)
      .get(path)
      .set('Cookie', cookieFor(testUser(level)));

    expect(res.status).toBe(404);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('403 do roleAuth usa errors no plural', async () => {
    const res = await request(app)
      .get('/users/999999')
      .set('Cookie', cookieFor(testUser(LEVELS.TEACHER)));

    expect(res.status).toBe(403);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('401 do loginRequired usa errors no plural', async () => {
    const res = await request(app).get('/staff');

    expect(res.status).toBe(401);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});
