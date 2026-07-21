import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';
import {
  parsePagination,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../src/utils/pagination.js';

import { setupTestData, teardownTestData, testUser } from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

// General Director alcança todos os index: manage_account (users), manage_record
// (staff/guardians/units) e o /students aberto a qualquer autenticado.
const DIRECTOR = () => cookieFor(testUser(LEVELS.GENERAL_DIRECTOR));

const PAGINATED_ENDPOINTS = [
  '/users',
  '/staff',
  '/guardians',
  '/students',
  '/units',
];

beforeAll(async () => {
  await setupTestData();
});

afterAll(async () => {
  await teardownTestData();
  await connection.close();
});

describe('parsePagination (helper)', () => {
  it('usa o default quando page/limit são ausentes', () => {
    expect(parsePagination({})).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
    });
  });

  it('cai no default quando page/limit não são numéricos', () => {
    expect(parsePagination({ page: 'abc', limit: 'xyz' })).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
    });
  });

  it('rejeita zero e negativos, caindo no default', () => {
    expect(parsePagination({ page: '0', limit: '-5' })).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
    });
  });

  it('limita o page size ao teto', () => {
    expect(parsePagination({ page: '2', limit: '999999' })).toEqual({
      page: 2,
      limit: MAX_PAGE_SIZE,
      offset: MAX_PAGE_SIZE,
    });
  });

  it('honra valores válidos e deriva o offset', () => {
    expect(parsePagination({ page: '3', limit: '10' })).toEqual({
      page: 3,
      limit: 10,
      offset: 20,
    });
  });
});

describe('contrato de paginação — query malformada não derruba o endpoint', () => {
  // Page não numérico deve cair no default, não virar LIMIT NaN e derrubar a
  // query — o contrato é uniforme entre os endpoints paginados.
  it.each(PAGINATED_ENDPOINTS)(
    '%s?page=abc devolve 200 com currentPage 1',
    async (path) => {
      const res = await request(app)
        .get(`${path}?page=abc&limit=xyz`)
        .set('Cookie', DIRECTOR());
      expect(res.status).toBe(200);
      expect(res.body.currentPage).toBe(1);
      expect(Array.isArray(res.body.data)).toBe(true);
    },
  );

  it.each(PAGINATED_ENDPOINTS)(
    '%s?limit=999999 não estoura a query',
    async (path) => {
      const res = await request(app)
        .get(`${path}?limit=999999`)
        .set('Cookie', DIRECTOR());
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(MAX_PAGE_SIZE);
    },
  );
});
