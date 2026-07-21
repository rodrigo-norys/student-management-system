import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';

import { setupTestData, teardownTestData, testUser } from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

const { Subject } = connection.models;

const ROLEAUTH_FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';
const DEMO_READONLY = 'Demo mode is read-only.';

const ABSENT_SUBJECT_ID = 999999;

// CAN_ACCESS reflete quem tem manage_academic no seed.
const CAN_ACCESS = [
  LEVELS.GENERAL_DIRECTOR,
  LEVELS.SCHOOL_OFFICE,
  LEVELS.ACADEMIC_COORDINATOR,
  LEVELS.TEACHER,
];
const CANNOT_ACCESS = [
  LEVELS.FINANCE_ADMIN,
  LEVELS.SECURITY,
  LEVELS.STUDENT,
  LEVELS.GUARDIAN,
];

const READABLE_SUBJECT = {
  id: 9601,
  name: 'Fixture Mathematics',
  code: 'FMAT01',
  knowledge_area: 'Exact Sciences',
  is_elective: 0,
  status: 'active',
};
const SECOND_SUBJECT = {
  id: 9602,
  name: 'Fixture Physics',
  code: 'FPHY01',
  is_elective: 0,
  status: 'active',
};
const DISPOSABLE_SUBJECT = {
  id: 9603,
  name: 'Fixture Chemistry',
  code: 'FCHM01',
  is_elective: 0,
  status: 'active',
};

const SUBJECT_FIXTURES = [READABLE_SUBJECT, SECOND_SUBJECT, DISPOSABLE_SUBJECT];
const fixtureIds = SUBJECT_FIXTURES.map((s) => s.id);
const CREATED_CODES = CAN_ACCESS.map((level) => `FCR${level}`);

async function destroySubjectFixtures() {
  await Subject.destroy({ where: { id: fixtureIds } });
  await Subject.destroy({ where: { code: CREATED_CODES } });
}

beforeAll(async () => {
  await setupTestData();
  await destroySubjectFixtures();
  await Subject.bulkCreate(SUBJECT_FIXTURES);
});

afterAll(async () => {
  await destroySubjectFixtures();
  await teardownTestData();
  await connection.close();
});

describe('subjectRoutes — autenticação', () => {
  it.each([
    ['get', '/subjects'],
    ['get', `/subjects/${ABSENT_SUBJECT_ID}`],
    ['post', '/subjects'],
    ['put', `/subjects/${ABSENT_SUBJECT_ID}`],
    ['delete', `/subjects/${ABSENT_SUBJECT_ID}`],
  ])('401 sem cookie em %s %s', async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
    expect(res.body.errors).toContain('Login required.');
  });
});

describe('subjectRoutes — manage_academic libera leitura e escrita', () => {
  it.each(CAN_ACCESS)('nível %i lista subjects', async (level) => {
    const res = await request(app)
      .get('/subjects')
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(
      SUBJECT_FIXTURES.length,
    );
  });

  it('show devolve só os campos da projeção whitelisted', async () => {
    const res = await request(app)
      .get(`/subjects/${READABLE_SUBJECT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.ACADEMIC_COORDINATOR)));
    expect(res.status).toBe(200);
    expect(Object.keys(res.body).sort()).toEqual([
      'code',
      'description',
      'id',
      'is_elective',
      'knowledge_area',
      'name',
      'status',
    ]);
  });

  // Âncora positiva: sem o create real, uma flag inexistente (typo) devolveria
  // 403 para todos e a matriz negativa passaria com a rota quebrada.
  it.each(CAN_ACCESS)('nível %i cria subject de fato', async (level) => {
    const res = await request(app)
      .post('/subjects')
      .set('Cookie', cookieFor(testUser(level)))
      .send({
        name: `Fixture Created L${level}`,
        code: `FCR${level}`,
        is_elective: 1,
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(`Fixture Created L${level}`);
    expect(res.body.is_elective).toBe(1);
    expect(res.body.status).toBe('active');
  });

  it.each(CAN_ACCESS)('nível %i atualiza de fato', async (level) => {
    const newName = `Fixture Physics L${level}`;
    const res = await request(app)
      .put(`/subjects/${SECOND_SUBJECT.id}`)
      .set('Cookie', cookieFor(testUser(level)))
      .send({ ...SECOND_SUBJECT, name: newName });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(newName);
  });

  it('delete desativa em vez de remover a linha', async () => {
    const res = await request(app)
      .delete(`/subjects/${DISPOSABLE_SUBJECT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.ACADEMIC_COORDINATOR)));
    expect(res.status).toBe(200);

    const row = await Subject.findByPk(DISPOSABLE_SUBJECT.id);
    expect(row).not.toBeNull();
    expect(row.status).toBe('inactive');
  });
});

describe('subjectRoutes — sem manage_academic recebe 403', () => {
  it.each(CANNOT_ACCESS)('nível %i recebe 403 ao listar', async (level) => {
    const res = await request(app)
      .get('/subjects')
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_ACCESS)('nível %i recebe 403 no create', async (level) => {
    const res = await request(app)
      .post('/subjects')
      .set('Cookie', cookieFor(testUser(level)))
      .send({ name: 'Guard Probe', code: 'GP01' });
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_ACCESS)('nível %i recebe 403 no delete', async (level) => {
    const res = await request(app)
      .delete(`/subjects/${READABLE_SUBJECT.id}`)
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
  });
});

describe('subjectRoutes — demo é somente leitura', () => {
  it.each([
    ['post', '/subjects'],
    ['put', `/subjects/${READABLE_SUBJECT.id}`],
    ['delete', `/subjects/${READABLE_SUBJECT.id}`],
  ])('demo recebe 403 em %s %s', async (method, path) => {
    const res = await request(app)
      [method](path)
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(DEMO_READONLY);
  });

  it('demo também não lê subjects (sem manage_academic)', async () => {
    const res = await request(app)
      .get('/subjects')
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });
});

describe('subjectRoutes — validação e contrato de erro', () => {
  it.each(['abc', '0', '-1'])('400 no show com id %s', async (id) => {
    const res = await request(app)
      .get(`/subjects/${id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Missing or invalid ID.');
  });

  it('duplicata devolve o campo, não o nome interno do índice', async () => {
    const res = await request(app)
      .post('/subjects')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({ name: READABLE_SUBJECT.name, code: 'FUNIQUE1' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toContain('name');
    expect(res.body.errors[0]).not.toContain('subjects_index');
  });

  it('status fora do ENUM devolve 400, não 500', async () => {
    const res = await request(app)
      .put(`/subjects/${READABLE_SUBJECT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({ status: 'bogus' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toContain('Status must be one of');
  });
});
