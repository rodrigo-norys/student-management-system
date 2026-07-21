import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';

import { setupTestData, teardownTestData, testUser } from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

const { UnitClass, Unit } = connection.models;

const ROLEAUTH_FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';
const DEMO_READONLY = 'Demo mode is read-only.';

const ABSENT_ID = 999999;

// CAN_READ reflete quem tem manage_academic no seed; a escrita exige ainda o
// piso de peso, que exclui o Teacher.
const CAN_READ = [
  LEVELS.GENERAL_DIRECTOR,
  LEVELS.SCHOOL_OFFICE,
  LEVELS.ACADEMIC_COORDINATOR,
  LEVELS.TEACHER,
];
const CAN_WRITE = [
  LEVELS.GENERAL_DIRECTOR,
  LEVELS.SCHOOL_OFFICE,
  LEVELS.ACADEMIC_COORDINATOR,
];
const CANNOT_ACCESS = [
  LEVELS.FINANCE_ADMIN,
  LEVELS.SECURITY,
  LEVELS.STUDENT,
  LEVELS.GUARDIAN,
];

const HOST_UNIT = {
  id: 9701,
  name: 'Fixture Host Unit',
  cnpj: '97010000000100',
  email: 'unit9701@test.local',
  phone: '1130007701',
  status: 'active',
};

const SCHOOL_YEAR = '2026';

const READABLE_CLASS = {
  id: 9801,
  unit_id: HOST_UNIT.id,
  name: '3A-FIX',
  grade_level: '3rd Grade',
  room_number: 'R101',
  shift: 'morning',
  school_year: SCHOOL_YEAR,
  max_students: 30,
  status: 'active',
};
const SECOND_CLASS = {
  id: 9802,
  unit_id: HOST_UNIT.id,
  name: '4B-FIX',
  grade_level: '4th Grade',
  room_number: 'R102',
  shift: 'afternoon',
  school_year: SCHOOL_YEAR,
  max_students: 25,
  status: 'active',
};
const DISPOSABLE_CLASS = {
  id: 9803,
  unit_id: HOST_UNIT.id,
  name: '5C-FIX',
  grade_level: '5th Grade',
  room_number: 'R103',
  shift: 'night',
  school_year: SCHOOL_YEAR,
  max_students: 20,
  status: 'active',
};

const CLASS_FIXTURES = [READABLE_CLASS, SECOND_CLASS, DISPOSABLE_CLASS];
const fixtureIds = CLASS_FIXTURES.map((c) => c.id);
const CREATED_NAMES = CAN_WRITE.map((level) => `NEW-L${level}`);

async function destroyFixtures() {
  await UnitClass.destroy({ where: { id: fixtureIds } });
  await UnitClass.destroy({ where: { name: CREATED_NAMES } });
  await Unit.destroy({ where: { id: HOST_UNIT.id } });
}

beforeAll(async () => {
  await setupTestData();
  await destroyFixtures();
  await Unit.create(HOST_UNIT);
  await UnitClass.bulkCreate(CLASS_FIXTURES);
});

afterAll(async () => {
  await destroyFixtures();
  await teardownTestData();
  await connection.close();
});

describe('unitClassRoutes — autenticação', () => {
  it.each([
    ['get', '/unit-classes'],
    ['get', `/unit-classes/${ABSENT_ID}`],
    ['post', '/unit-classes'],
    ['put', `/unit-classes/${ABSENT_ID}`],
    ['delete', `/unit-classes/${ABSENT_ID}`],
  ])('401 sem cookie em %s %s', async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
    expect(res.body.errors).toContain('Login required.');
  });
});

describe('unitClassRoutes — manage_academic libera leitura e escrita', () => {
  it.each(CAN_READ)('nível %i lista turmas', async (level) => {
    const res = await request(app)
      .get('/unit-classes')
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(CLASS_FIXTURES.length);
  });

  it('index inclui a unidade em projeção reduzida', async () => {
    const res = await request(app)
      .get(`/unit-classes?unit_id=${HOST_UNIT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.ACADEMIC_COORDINATOR)));
    expect(res.status).toBe(200);
    expect(res.body.data[0].unit).toEqual({
      id: HOST_UNIT.id,
      name: HOST_UNIT.name,
    });
  });

  // Âncora positiva: sem o create real, uma flag inexistente devolveria 403
  // para todos e a matriz negativa passaria com a rota quebrada.
  it.each(CAN_WRITE)('nível %i cria turma de fato', async (level) => {
    const res = await request(app)
      .post('/unit-classes')
      .set('Cookie', cookieFor(testUser(level)))
      .send({
        unit_id: HOST_UNIT.id,
        name: `NEW-L${level}`,
        grade_level: '1st Grade',
        room_number: `N${level}`,
        shift: 'morning',
        school_year: SCHOOL_YEAR,
        max_students: 20,
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(`NEW-L${level}`);
    expect(res.body.unit.id).toBe(HOST_UNIT.id);
  });

  it.each(CAN_WRITE)('nível %i atualiza de fato', async (level) => {
    const newGrade = `Grade L${level}`;
    const res = await request(app)
      .put(`/unit-classes/${SECOND_CLASS.id}`)
      .set('Cookie', cookieFor(testUser(level)))
      .send({ ...SECOND_CLASS, grade_level: newGrade });
    expect(res.status).toBe(200);
    expect(res.body.grade_level).toBe(newGrade);
  });

  it('show devolve a turma com a unidade associada', async () => {
    const res = await request(app)
      .get(`/unit-classes/${READABLE_CLASS.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.TEACHER)));
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(READABLE_CLASS.id);
    expect(res.body.unit).toEqual({ id: HOST_UNIT.id, name: HOST_UNIT.name });
  });

  it('delete desativa em vez de remover a linha', async () => {
    const res = await request(app)
      .delete(`/unit-classes/${DISPOSABLE_CLASS.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.ACADEMIC_COORDINATOR)));
    expect(res.status).toBe(200);

    const row = await UnitClass.findByPk(DISPOSABLE_CLASS.id);
    expect(row).not.toBeNull();
    expect(row.status).toBe('inactive');
  });
});

describe('unitClassRoutes — sem manage_academic recebe 403', () => {
  it.each(CANNOT_ACCESS)('nível %i recebe 403 ao listar', async (level) => {
    const res = await request(app)
      .get('/unit-classes')
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_ACCESS)('nível %i recebe 403 no create', async (level) => {
    const res = await request(app)
      .post('/unit-classes')
      .set('Cookie', cookieFor(testUser(level)))
      .send({ unit_id: HOST_UNIT.id, name: 'PROBE' });
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_ACCESS)('nível %i recebe 403 no show', async (level) => {
    const res = await request(app)
      .get(`/unit-classes/${READABLE_CLASS.id}`)
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_ACCESS)('nível %i recebe 403 no update', async (level) => {
    const res = await request(app)
      .put(`/unit-classes/${READABLE_CLASS.id}`)
      .set('Cookie', cookieFor(testUser(level)))
      .send({ name: 'PROBE' });
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_ACCESS)('nível %i recebe 403 no delete', async (level) => {
    const res = await request(app)
      .delete(`/unit-classes/${READABLE_CLASS.id}`)
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });
});

// O Teacher é o caso decisivo do piso de peso: tem manage_academic (logo passa
// pelo roleAuth) mas não alcança o peso mínimo de escrita.
describe('unitClassRoutes — Teacher lê mas não gerencia', () => {
  it('Teacher lista turmas normalmente', async () => {
    const res = await request(app)
      .get('/unit-classes')
      .set('Cookie', cookieFor(testUser(LEVELS.TEACHER)));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(CLASS_FIXTURES.length);
  });

  it('Teacher abre uma turma normalmente', async () => {
    const res = await request(app)
      .get(`/unit-classes/${READABLE_CLASS.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.TEACHER)));
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(READABLE_CLASS.id);
  });

  it.each([
    ['post', '/unit-classes'],
    ['put', `/unit-classes/${READABLE_CLASS.id}`],
    ['delete', `/unit-classes/${READABLE_CLASS.id}`],
  ])('Teacher recebe 403 em %s %s', async (method, path) => {
    const res = await request(app)
      [method](path)
      .set('Cookie', cookieFor(testUser(LEVELS.TEACHER)))
      .send({
        unit_id: HOST_UNIT.id,
        name: 'TEACHER-PROBE',
        grade_level: '1st Grade',
        room_number: 'TP1',
        shift: 'morning',
        school_year: SCHOOL_YEAR,
        max_students: 10,
      });
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain('Forbidden or restricted action.');
  });

  it('nenhuma turma foi criada pelo Teacher', async () => {
    const leaked = await UnitClass.findOne({
      where: { name: 'TEACHER-PROBE' },
    });
    expect(leaked).toBeNull();
  });
});

describe('unitClassRoutes — demo é somente leitura', () => {
  it.each([
    ['post', '/unit-classes'],
    ['put', `/unit-classes/${READABLE_CLASS.id}`],
    ['delete', `/unit-classes/${READABLE_CLASS.id}`],
  ])('demo recebe 403 em %s %s', async (method, path) => {
    const res = await request(app)
      [method](path)
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(DEMO_READONLY);
  });
});

describe('unitClassRoutes — integridade referencial e unicidade composta', () => {
  it('unit_id inexistente devolve 400, não 500', async () => {
    const res = await request(app)
      .post('/unit-classes')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({
        unit_id: ABSENT_ID,
        name: 'ORPHAN',
        grade_level: '1st Grade',
        room_number: 'R999',
        shift: 'morning',
        school_year: SCHOOL_YEAR,
        max_students: 10,
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(
      'Relation error: Referenced ID not found.',
    );
  });

  it('duplicata de nome no mesmo ano e unidade explica a combinação', async () => {
    const res = await request(app)
      .post('/unit-classes')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({
        unit_id: HOST_UNIT.id,
        name: READABLE_CLASS.name,
        grade_level: '3rd Grade',
        room_number: 'R500',
        shift: 'night',
        school_year: SCHOOL_YEAR,
        max_students: 15,
      });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toContain('name in the same school year');
    expect(res.body.errors[0]).not.toContain('unit_classes_index');
  });

  it('duplicata de sala/turno no mesmo ano explica a combinação', async () => {
    const res = await request(app)
      .post('/unit-classes')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({
        unit_id: HOST_UNIT.id,
        name: 'OTHER-NAME',
        grade_level: '3rd Grade',
        room_number: READABLE_CLASS.room_number,
        shift: READABLE_CLASS.shift,
        school_year: SCHOOL_YEAR,
        max_students: 15,
      });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toContain('room, shift and school year');
    expect(res.body.errors[0]).not.toContain('unit_classes_index');
  });
});

describe('unitClassRoutes — validação', () => {
  it.each(['abc', '0', '-1'])('400 no show com id %s', async (id) => {
    const res = await request(app)
      .get(`/unit-classes/${id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Missing or invalid ID.');
  });

  it('status fora do ENUM devolve 400, não 500', async () => {
    const res = await request(app)
      .put(`/unit-classes/${READABLE_CLASS.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({ status: 'bogus' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toContain('Status must be one of');
  });
});
