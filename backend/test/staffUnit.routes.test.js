import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';

import {
  setupTestData,
  teardownTestData,
  testUser,
  DIRECTOR_STAFF,
  ORDINARY_STAFF,
  ORPHAN_STAFF,
  FINANCE_STAFF,
  SECURITY_STAFF,
} from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

const { StaffUnit, Unit, Staff } = connection.models;

const ROLEAUTH_FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';
const DEMO_READONLY = 'Demo mode is read-only.';
const RESTRICTED_ACTION = 'Forbidden or restricted action.';
const ALREADY_ASSIGNED = 'This staff member is already assigned to this unit.';
const RELATION_ERROR = 'Relation error: Referenced ID not found.';

const ABSENT_ID = 999999;

// A leitura segue manage_record, que alcança o Finance; a escrita exige
// manage_account, que não.
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

const HOST_UNIT = {
  id: 9702,
  name: 'Fixture Assignment Unit',
  cnpj: '97020000000100',
  email: 'unit9702@test.local',
  phone: '1130007702',
  status: 'active',
};
const SECOND_UNIT = {
  id: 9703,
  name: 'Fixture Assignment Unit B',
  cnpj: '97030000000100',
  email: 'unit9703@test.local',
  phone: '1130007703',
  status: 'active',
};
const UNIT_FIXTURES = [HOST_UNIT, SECOND_UNIT];
const unitIds = UNIT_FIXTURES.map((u) => u.id);

const READABLE_ASSIGNMENT = {
  id: 9901,
  staff_id: ORDINARY_STAFF.id,
  unit_id: HOST_UNIT.id,
  status: 'active',
};
// Ficha sem conta: isola o caminho feliz da guarda de peso.
const REMOVABLE_ASSIGNMENT = {
  id: 9902,
  staff_id: ORPHAN_STAFF.id,
  unit_id: HOST_UNIT.id,
  status: 'active',
};
const INACTIVE_ASSIGNMENT = {
  id: 9903,
  staff_id: ORPHAN_STAFF.id,
  unit_id: SECOND_UNIT.id,
  status: 'inactive',
};
// Alvo de nível 1: só um ator de peso igual ou maior pode mexer.
const PROTECTED_ASSIGNMENT = {
  id: 9904,
  staff_id: DIRECTOR_STAFF.id,
  unit_id: HOST_UNIT.id,
  status: 'active',
};

// Ficha do próprio ator nível 2. As fixtures compartilhadas não ligam nenhuma
// ficha aos atores dos testes, então sem ela a auto-lotação fica sem cobertura.
const SELF_STAFF = {
  id: 9108,
  user_id: 9002,
  full_name: 'Staff Fixture 9108',
  email: 'staff9108@test.local',
  cpf: '99900091080',
  birth_date: '1980-01-01',
  phone: '11999909108',
  personal_email: 'staff9108.personal@test.local',
  job_title: 'Fixture Role',
  hiring_date: '2020-01-01',
  status: 'active',
};

const ASSIGNMENT_FIXTURES = [
  READABLE_ASSIGNMENT,
  REMOVABLE_ASSIGNMENT,
  INACTIVE_ASSIGNMENT,
  PROTECTED_ASSIGNMENT,
];
const assignmentIds = ASSIGNMENT_FIXTURES.map((a) => a.id);

// Um par livre por ator da escrita: sem isso o segundo caso bateria na
// duplicata criada pelo primeiro.
const CREATE_TARGETS = {
  [LEVELS.GENERAL_DIRECTOR]: FINANCE_STAFF.id,
  [LEVELS.SCHOOL_OFFICE]: SECURITY_STAFF.id,
};

async function resetAssignments() {
  await StaffUnit.destroy({ where: { unit_id: unitIds } });
  await StaffUnit.destroy({ where: { id: assignmentIds } });
  await StaffUnit.bulkCreate(ASSIGNMENT_FIXTURES);
}

async function destroyFixtures() {
  await StaffUnit.destroy({ where: { unit_id: unitIds } });
  await StaffUnit.destroy({ where: { id: assignmentIds } });
  await StaffUnit.destroy({ where: { staff_id: SELF_STAFF.id } });
  await Staff.destroy({ where: { id: SELF_STAFF.id } });
  await Unit.destroy({ where: { id: unitIds } });
}

function statusOfAssignment(id) {
  return StaffUnit.findByPk(id).then((row) => row?.status);
}

beforeAll(async () => {
  await setupTestData();
  await destroyFixtures();
  await Unit.bulkCreate(UNIT_FIXTURES);
  await Staff.create(SELF_STAFF);
});

beforeEach(async () => {
  await resetAssignments();
});

afterAll(async () => {
  await destroyFixtures();
  await teardownTestData();
  await connection.close();
});

describe('staffUnitRoutes — autenticação', () => {
  it.each([
    ['get', '/staff-units'],
    ['get', `/staff-units/${ABSENT_ID}`],
    ['post', '/staff-units'],
    ['put', `/staff-units/${ABSENT_ID}`],
    ['delete', `/staff-units/${ABSENT_ID}`],
  ])('401 sem cookie em %s %s', async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
    expect(res.body.errors).toContain('Login required.');
  });
});

describe('staffUnitRoutes — manage_record libera a leitura', () => {
  it.each(CAN_READ)('nível %i lista lotações', async (level) => {
    const res = await request(app)
      .get('/staff-units')
      .set('Cookie', cookieFor(testUser(level)));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it.each(CAN_READ)('nível %i abre uma lotação', async (level) => {
    const res = await request(app)
      .get(`/staff-units/${READABLE_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(level)));

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(READABLE_ASSIGNMENT.id);
  });
});

describe('staffUnitRoutes — sem manage_record a leitura é barrada', () => {
  it.each(CANNOT_READ)('nível %i não lista', async (level) => {
    const res = await request(app)
      .get('/staff-units')
      .set('Cookie', cookieFor(testUser(level)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_READ)('nível %i não abre lotação', async (level) => {
    const res = await request(app)
      .get(`/staff-units/${READABLE_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(level)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });
});

describe('staffUnitRoutes — manage_account libera a escrita', () => {
  it.each(CAN_WRITE)('nível %i lota de fato', async (level) => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', cookieFor(testUser(level)))
      .send({ staff_id: CREATE_TARGETS[level], unit_id: HOST_UNIT.id });

    expect(res.status).toBe(201);
    expect(res.body.staff_id).toBe(CREATE_TARGETS[level]);
    expect(res.body.unit_id).toBe(HOST_UNIT.id);
    expect(res.body.status).toBe('active');
    expect(await statusOfAssignment(res.body.id)).toBe('active');
  });

  it.each(CAN_WRITE)('nível %i atualiza o status de fato', async (level) => {
    const res = await request(app)
      .put(`/staff-units/${READABLE_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(level)))
      .send({ status: 'inactive' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('inactive');
    expect(await statusOfAssignment(READABLE_ASSIGNMENT.id)).toBe('inactive');
  });

  it.each(CAN_WRITE)('nível %i deslota de fato', async (level) => {
    const res = await request(app)
      .delete(`/staff-units/${REMOVABLE_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(level)));

    expect(res.status).toBe(200);
    expect(await statusOfAssignment(REMOVABLE_ASSIGNMENT.id)).toBe('inactive');
  });
});

describe('staffUnitRoutes — sem manage_account a escrita é barrada', () => {
  it.each(CANNOT_WRITE)('nível %i não lota', async (level) => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', cookieFor(testUser(level)))
      .send({ staff_id: FINANCE_STAFF.id, unit_id: SECOND_UNIT.id });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it.each(CANNOT_WRITE)('nível %i não atualiza', async (level) => {
    const res = await request(app)
      .put(`/staff-units/${READABLE_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(level)))
      .send({ status: 'inactive' });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
    expect(await statusOfAssignment(READABLE_ASSIGNMENT.id)).toBe('active');
  });

  it.each(CANNOT_WRITE)('nível %i não deslota', async (level) => {
    const res = await request(app)
      .delete(`/staff-units/${REMOVABLE_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(level)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
    expect(await statusOfAssignment(REMOVABLE_ASSIGNMENT.id)).toBe('active');
  });
});

describe('staffUnitRoutes — Finance lê mas não gerencia', () => {
  it('nível 3 lista lotações', async () => {
    const res = await request(app)
      .get('/staff-units')
      .set('Cookie', cookieFor(testUser(LEVELS.FINANCE_ADMIN)));

    expect(res.status).toBe(200);
  });

  it('nível 3 é barrado ao lotar', async () => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', cookieFor(testUser(LEVELS.FINANCE_ADMIN)))
      .send({ staff_id: SECURITY_STAFF.id, unit_id: HOST_UNIT.id });

    expect(res.status).toBe(403);
    const created = await StaffUnit.findOne({
      where: { staff_id: SECURITY_STAFF.id, unit_id: HOST_UNIT.id },
    });
    expect(created).toBeNull();
  });
});

describe('staffUnitRoutes — demo é read-only', () => {
  it.each([
    ['post', '/staff-units'],
    ['put', `/staff-units/${READABLE_ASSIGNMENT.id}`],
    ['delete', `/staff-units/${READABLE_ASSIGNMENT.id}`],
  ])('demo é barrado em %s %s', async (method, path) => {
    const res = await request(app)
      [method](path)
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)))
      .send({ staff_id: ORPHAN_STAFF.id, unit_id: SECOND_UNIT.id });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(DEMO_READONLY);
  });
});

describe('staffUnitRoutes — o par desfeito volta a ser lotável', () => {
  it('lotar de novo reativa a linha em vez de colidir com o índice único', async () => {
    const director = cookieFor(testUser(LEVELS.GENERAL_DIRECTOR));

    const removal = await request(app)
      .delete(`/staff-units/${REMOVABLE_ASSIGNMENT.id}`)
      .set('Cookie', director);
    expect(removal.status).toBe(200);
    expect(await statusOfAssignment(REMOVABLE_ASSIGNMENT.id)).toBe('inactive');

    const rehire = await request(app)
      .post('/staff-units')
      .set('Cookie', director)
      .send({
        staff_id: REMOVABLE_ASSIGNMENT.staff_id,
        unit_id: REMOVABLE_ASSIGNMENT.unit_id,
      });

    expect(rehire.status).toBe(200);
    expect(rehire.body.id).toBe(REMOVABLE_ASSIGNMENT.id);
    expect(rehire.body.status).toBe('active');
    expect(await statusOfAssignment(REMOVABLE_ASSIGNMENT.id)).toBe('active');
  });

  it('lotação inativa preexistente é reativada, sem linha nova', async () => {
    const before = await StaffUnit.count({ where: { unit_id: unitIds } });

    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({
        staff_id: INACTIVE_ASSIGNMENT.staff_id,
        unit_id: INACTIVE_ASSIGNMENT.unit_id,
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(INACTIVE_ASSIGNMENT.id);
    expect(await StaffUnit.count({ where: { unit_id: unitIds } })).toBe(before);
  });

  it('lotação ativa duplicada é recusada', async () => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({
        staff_id: READABLE_ASSIGNMENT.staff_id,
        unit_id: READABLE_ASSIGNMENT.unit_id,
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(ALREADY_ASSIGNED);
  });
});

describe('staffUnitRoutes — peso hierárquico do alvo', () => {
  it('nível 2 não lota um alvo de nível 1', async () => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)))
      .send({ staff_id: DIRECTOR_STAFF.id, unit_id: SECOND_UNIT.id });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(RESTRICTED_ACTION);
  });

  it('nível 1 lota o mesmo alvo', async () => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({ staff_id: DIRECTOR_STAFF.id, unit_id: SECOND_UNIT.id });

    expect(res.status).toBe(201);
  });

  it('nível 2 não deslota um alvo de nível 1', async () => {
    const res = await request(app)
      .delete(`/staff-units/${PROTECTED_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(RESTRICTED_ACTION);
    expect(await statusOfAssignment(PROTECTED_ASSIGNMENT.id)).toBe('active');
  });

  it('nível 1 deslota o mesmo alvo', async () => {
    const res = await request(app)
      .delete(`/staff-units/${PROTECTED_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));

    expect(res.status).toBe(200);
    expect(await statusOfAssignment(PROTECTED_ASSIGNMENT.id)).toBe('inactive');
  });

  it('nível 2 não atualiza o status de um alvo de nível 1', async () => {
    const res = await request(app)
      .put(`/staff-units/${PROTECTED_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)))
      .send({ status: 'inactive' });

    expect(res.status).toBe(403);
    expect(await statusOfAssignment(PROTECTED_ASSIGNMENT.id)).toBe('active');
  });

  it('o ator lota a própria ficha', async () => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)))
      .send({ staff_id: SELF_STAFF.id, unit_id: SECOND_UNIT.id });

    expect(res.status).toBe(201);
    expect(res.body.staff_id).toBe(SELF_STAFF.id);
  });

  it('o ator deslota a própria ficha', async () => {
    const officeCookie = cookieFor(testUser(LEVELS.SCHOOL_OFFICE));

    const assignment = await request(app)
      .post('/staff-units')
      .set('Cookie', officeCookie)
      .send({ staff_id: SELF_STAFF.id, unit_id: SECOND_UNIT.id });

    const res = await request(app)
      .delete(`/staff-units/${assignment.body.id}`)
      .set('Cookie', officeCookie);

    expect(res.status).toBe(200);
  });

  it('ficha sem conta vinculada não é barrada pela guarda', async () => {
    const res = await request(app)
      .delete(`/staff-units/${REMOVABLE_ASSIGNMENT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)));

    expect(res.status).toBe(200);
  });
});

describe('staffUnitRoutes — validação de entrada', () => {
  const director = () => cookieFor(testUser(LEVELS.GENERAL_DIRECTOR));

  it.each([
    ['sem staff_id', { unit_id: HOST_UNIT.id }],
    ['sem unit_id', { staff_id: ORPHAN_STAFF.id }],
    ['staff_id não numérico', { staff_id: 'abc', unit_id: HOST_UNIT.id }],
    ['unit_id não numérico', { staff_id: ORPHAN_STAFF.id, unit_id: 'abc' }],
    ['staff_id zero', { staff_id: 0, unit_id: HOST_UNIT.id }],
    ['unit_id negativo', { staff_id: ORPHAN_STAFF.id, unit_id: -3 }],
  ])('400 ao lotar %s', async (_label, payload) => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', director())
      .send(payload);

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('400 ao lotar staff inexistente', async () => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', director())
      .send({ staff_id: ABSENT_ID, unit_id: HOST_UNIT.id });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(RELATION_ERROR);
  });

  it('400 ao lotar em unidade inexistente', async () => {
    const res = await request(app)
      .post('/staff-units')
      .set('Cookie', director())
      .send({ staff_id: ORPHAN_STAFF.id, unit_id: ABSENT_ID });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(RELATION_ERROR);
  });

  it.each([
    ['staff_id', '/staff-units?staff_id=abc'],
    ['unit_id', '/staff-units?unit_id=abc'],
    ['status', '/staff-units?status=bogus'],
    // O query parser é o simple: parâmetro repetido chega como array.
    ['status repetido', '/staff-units?status=active&status=inactive'],
    ['staff_id repetido', '/staff-units?staff_id=9102&staff_id=9103'],
  ])('400 no filtro inválido de %s', async (_label, path) => {
    const res = await request(app).get(path).set('Cookie', director());

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it.each([
    ['sem status', {}],
    ['status fora do ENUM', { status: 'suspended' }],
    ['status como objeto', { status: { gt: 1 } }],
    ['status como array', { status: ['active'] }],
  ])('400 ao atualizar %s', async (_label, payload) => {
    const res = await request(app)
      .put(`/staff-units/${READABLE_ASSIGNMENT.id}`)
      .set('Cookie', director())
      .send(payload);

    expect(res.status).toBe(400);
    expect(await statusOfAssignment(READABLE_ASSIGNMENT.id)).toBe('active');
  });

  it('update não move o vínculo entre staff ou unidade', async () => {
    const res = await request(app)
      .put(`/staff-units/${READABLE_ASSIGNMENT.id}`)
      .set('Cookie', director())
      .send({
        status: 'active',
        staff_id: ORPHAN_STAFF.id,
        unit_id: SECOND_UNIT.id,
      });

    expect(res.status).toBe(200);
    expect(res.body.staff_id).toBe(READABLE_ASSIGNMENT.staff_id);
    expect(res.body.unit_id).toBe(READABLE_ASSIGNMENT.unit_id);
  });

  it.each([
    ['get', 'abc'],
    ['put', 'abc'],
    ['delete', 'abc'],
  ])('400 em %s com id não numérico', async (method, id) => {
    const res = await request(app)
      [method](`/staff-units/${id}`)
      .set('Cookie', director())
      .send({ status: 'inactive' });

    expect(res.status).toBe(400);
  });

  it.each(['get', 'put', 'delete'])(
    '404 em %s com id ausente',
    async (method) => {
      const res = await request(app)
        [method](`/staff-units/${ABSENT_ID}`)
        .set('Cookie', director())
        .send({ status: 'inactive' });

      expect(res.status).toBe(404);
    },
  );
});

describe('staffUnitRoutes — projeção e filtros', () => {
  const director = () => cookieFor(testUser(LEVELS.GENERAL_DIRECTOR));

  it('a resposta não vaza dados pessoais da ficha', async () => {
    const res = await request(app)
      .get(`/staff-units/${READABLE_ASSIGNMENT.id}`)
      .set('Cookie', director());

    expect(res.status).toBe(200);
    expect(Object.keys(res.body).sort()).toEqual([
      'id',
      'staff',
      'staff_id',
      'status',
      'unit',
      'unit_id',
    ]);
    expect(Object.keys(res.body.staff).sort()).toEqual([
      'full_name',
      'id',
      'job_title',
    ]);
    expect(Object.keys(res.body.unit).sort()).toEqual(['id', 'name']);
  });

  it('filtra por staff_id', async () => {
    const res = await request(app)
      .get(`/staff-units?staff_id=${ORPHAN_STAFF.id}`)
      .set('Cookie', director());

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((a) => a.staff_id === ORPHAN_STAFF.id)).toBe(
      true,
    );
  });

  it('filtra por unit_id', async () => {
    const res = await request(app)
      .get(`/staff-units?unit_id=${SECOND_UNIT.id}`)
      .set('Cookie', director());

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((a) => a.unit_id === SECOND_UNIT.id)).toBe(true);
  });

  it('filtra por status', async () => {
    const res = await request(app)
      .get(`/staff-units?unit_id=${SECOND_UNIT.id}&status=inactive`)
      .set('Cookie', director());

    expect(res.status).toBe(200);
    expect(res.body.data.every((a) => a.status === 'inactive')).toBe(true);
    expect(res.body.data.some((a) => a.id === INACTIVE_ASSIGNMENT.id)).toBe(
      true,
    );
  });

  it('devolve o envelope canônico de paginação', async () => {
    const res = await request(app)
      .get('/staff-units?page=1&limit=2')
      .set('Cookie', director());

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ currentPage: 1 });
    expect(typeof res.body.totalItems).toBe('number');
    expect(typeof res.body.totalPages).toBe('number');
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });
});
