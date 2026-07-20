import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';

import { setupTestData, teardownTestData, testUser } from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

const { Unit, Address } = connection.models;

const ROLEAUTH_FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';
const DEMO_READONLY = 'Demo mode is read-only.';
const ADDRESS_NOT_A_LIST = 'Address must be a single object, not a list.';

// Id inexistente: o guard de autorização roda antes da busca, então um nível
// autorizado chega ao 404 e um não autorizado para no 403.
const ABSENT_UNIT_ID = 999999;

// Ids acima de 9500 para não colidir com seed nem com as fixtures de ator.
const READABLE_UNIT = {
  id: 9501,
  name: 'Fixture Unit Alpha',
  cnpj: '95010000000100',
  email: 'unit9501@test.local',
  phone: '1130000001',
  status: 'active',
};
const SECOND_UNIT = {
  id: 9502,
  name: 'Fixture Unit Beta',
  cnpj: '95020000000100',
  email: 'unit9502@test.local',
  phone: '1130000002',
  status: 'active',
};
// Absorve o soft delete e mantém as outras fixtures intactas.
const DISPOSABLE_UNIT = {
  id: 9503,
  name: 'Fixture Unit Gamma',
  cnpj: '95030000000100',
  email: 'unit9503@test.local',
  phone: '1130000003',
  status: 'active',
};

const UNIT_FIXTURES = [READABLE_UNIT, SECOND_UNIT, DISPOSABLE_UNIT];
const fixtureIds = UNIT_FIXTURES.map((u) => u.id);

// Emails das unidades nascidas do caminho feliz de create: o id é gerado pelo
// banco, então o teardown as encontra por aqui.
const CREATED_EMAILS = [LEVELS.GENERAL_DIRECTOR, LEVELS.SCHOOL_OFFICE].map(
  (level) => `created-by-lvl${level}@test.local`,
);

const CAN_READ = [
  LEVELS.GENERAL_DIRECTOR,
  LEVELS.SCHOOL_OFFICE,
  LEVELS.FINANCE_ADMIN,
];
const CANNOT_READ = [
  LEVELS.ACADEMIC_COORDINATOR,
  LEVELS.TEACHER,
  LEVELS.SECURITY,
  LEVELS.STUDENT,
  LEVELS.GUARDIAN,
];
const CAN_WRITE = [LEVELS.GENERAL_DIRECTOR, LEVELS.SCHOOL_OFFICE];
const CANNOT_WRITE = [
  LEVELS.FINANCE_ADMIN,
  LEVELS.ACADEMIC_COORDINATOR,
  LEVELS.TEACHER,
  LEVELS.SECURITY,
  LEVELS.STUDENT,
  LEVELS.GUARDIAN,
];

async function destroyUnitFixtures() {
  await Address.destroy({ where: { unit_id: fixtureIds } });
  await Unit.destroy({ where: { id: fixtureIds } });
  await Unit.destroy({ where: { email: CREATED_EMAILS } });
}

beforeAll(async () => {
  await setupTestData();
  await destroyUnitFixtures();
  await Unit.bulkCreate(UNIT_FIXTURES);
});

afterAll(async () => {
  await destroyUnitFixtures();
  await teardownTestData();
  await connection.close();
});

describe('unitRoutes — autenticação', () => {
  it.each([
    ['get', '/units'],
    ['get', `/units/${ABSENT_UNIT_ID}`],
    ['post', '/units'],
    ['put', `/units/${ABSENT_UNIT_ID}`],
    ['delete', `/units/${ABSENT_UNIT_ID}`],
  ])('401 sem cookie em %s %s', async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
    expect(res.body.errors).toContain('Login required.');
  });
});

describe('unitRoutes — leitura sob manage_record', () => {
  it.each(CAN_READ)('nível %i lista unidades', async (level) => {
    const res = await request(app)
      .get('/units')
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(UNIT_FIXTURES.length);
  });

  it.each(CANNOT_READ)('nível %i recebe 403 ao listar', async (level) => {
    const res = await request(app)
      .get('/units')
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_READ)('nível %i recebe 403 no show', async (level) => {
    const res = await request(app)
      .get(`/units/${READABLE_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it('show devolve só os campos da projeção whitelisted', async () => {
    const res = await request(app)
      .get(`/units/${READABLE_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(200);
    expect(Object.keys(res.body).sort()).toEqual([
      'address',
      'cnpj',
      'email',
      'id',
      'name',
      'phone',
      'status',
    ]);
  });
});

describe('unitRoutes — escrita sob manage_account', () => {
  // Finance Admin é o caso decisivo do split de flags: lê unidades
  // (manage_record) mas não pode tocar na identidade fiscal da rede.
  it.each(CANNOT_WRITE)('nível %i recebe 403 no create', async (level) => {
    const res = await request(app)
      .post('/units')
      .set('Cookie', cookieFor(testUser(level)))
      .send({ name: 'Guard Probe Unit' });
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_WRITE)('nível %i recebe 403 no update', async (level) => {
    const res = await request(app)
      .put(`/units/${READABLE_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(level)))
      .send({ name: 'Guard Probe Unit' });
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_WRITE)('nível %i recebe 403 no delete', async (level) => {
    const res = await request(app)
      .delete(`/units/${READABLE_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  // Âncora positiva: sem ela, uma flag inexistente (typo) devolveria 403 para
  // todos os níveis e a matriz negativa acima passaria mesmo assim.
  it.each(CAN_WRITE)('nível %i cria unidade de fato', async (level) => {
    const res = await request(app)
      .post('/units')
      .set('Cookie', cookieFor(testUser(level)))
      .send({
        name: `Fixture Created By Lvl${level}`,
        cnpj: `9900000000${level}`,
        email: `created-by-lvl${level}@test.local`,
        phone: '1130009999',
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(`Fixture Created By Lvl${level}`);
    expect(res.body.status).toBe('active');
  });

  it.each(CAN_WRITE)('nível %i atualiza de fato', async (level) => {
    const newName = `Fixture Unit Beta Lvl${level}`;
    const res = await request(app)
      .put(`/units/${SECOND_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(level)))
      .send({ ...SECOND_UNIT, name: newName });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(newName);
  });

  it.each(CAN_WRITE)('nível %i chega ao 404 em id ausente', async (level) => {
    const res = await request(app)
      .delete(`/units/${ABSENT_UNIT_ID}`)
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(404);
    expect(res.body.errors).toContain('Unit not found.');
  });

  it('delete desativa em vez de remover a linha', async () => {
    const res = await request(app)
      .delete(`/units/${DISPOSABLE_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(200);

    const row = await Unit.findByPk(DISPOSABLE_UNIT.id);
    expect(row).not.toBeNull();
    expect(row.status).toBe('inactive');
  });
});

describe('unitRoutes — demo é somente leitura', () => {
  it.each([
    ['post', '/units'],
    ['put', `/units/${READABLE_UNIT.id}`],
    ['delete', `/units/${READABLE_UNIT.id}`],
  ])('demo recebe 403 em %s %s', async (method, path) => {
    const res = await request(app)
      [method](path)
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(DEMO_READONLY);
  });

  it('demo também não lê units (sem manage_record)', async () => {
    const res = await request(app)
      .get('/units')
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });
});

describe('unitRoutes — validação de id', () => {
  it.each(['abc', '0', '-1'])('400 no show com id %s', async (id) => {
    const res = await request(app)
      .get(`/units/${id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Missing or invalid ID.');
  });

  it.each(['abc', '0', '-1'])('400 no update com id %s', async (id) => {
    const res = await request(app)
      .put(`/units/${id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({ name: 'Irrelevant' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Missing or invalid ID.');
  });

  it.each(['abc', '0', '-1'])('400 no delete com id %s', async (id) => {
    const res = await request(app)
      .delete(`/units/${id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Missing or invalid ID.');
  });
});

describe('unitRoutes — payload de address', () => {
  it('rejeita address como lista no create', async () => {
    const res = await request(app)
      .post('/units')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({
        name: 'Fixture Array Address',
        cnpj: '99110000000100',
        email: 'array-address@test.local',
        phone: '1130001111',
        address: [{ zip_code: '20000-000' }],
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(ADDRESS_NOT_A_LIST);
  });

  it('rejeita address como lista no update', async () => {
    const res = await request(app)
      .put(`/units/${READABLE_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({ address: [{ zip_code: '20000-000' }] });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(ADDRESS_NOT_A_LIST);
  });

  // Sem a allowlist, o valor fora do ENUM chega ao MariaDB como "Data
  // truncated" e o erro de input do cliente vira 500.
  it('rejeita status fora do ENUM com 400, não 500', async () => {
    const res = await request(app)
      .put(`/units/${READABLE_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({ status: 'bogus' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toContain('Status must be one of');
  });
});

describe('unitRoutes — duplicata em índice único', () => {
  it('devolve o campo, não o nome interno do índice', async () => {
    const res = await request(app)
      .post('/units')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({
        name: READABLE_UNIT.name,
        cnpj: '99220000000100',
        email: 'duplicate-probe@test.local',
        phone: '1130002222',
      });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toContain('name');
    expect(res.body.errors[0]).not.toContain('units_name_unique');
  });
});

describe('unitRoutes — paginação normalizada', () => {
  it('honra o limit informado', async () => {
    const res = await request(app)
      .get('/units?limit=1')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.totalItems).toBeGreaterThanOrEqual(UNIT_FIXTURES.length);
  });

  it('page e limit não numéricos caem no default em vez de erro de SQL', async () => {
    const res = await request(app)
      .get('/units?page=abc&limit=xyz')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(200);
    expect(res.body.currentPage).toBe(1);
    expect(res.body.data.length).toBeGreaterThanOrEqual(UNIT_FIXTURES.length);
  });

  it('limit acima do teto não estoura a query', async () => {
    const res = await request(app)
      .get('/units?limit=999999')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(200);
    expect(res.body.currentPage).toBe(1);
  });
});
