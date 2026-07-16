import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';

import {
  setupTestData,
  teardownTestData,
  resetFixtureStatuses,
  testUser,
  TEST_USERS,
  ORDINARY_STAFF,
} from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

const { Staff, Guardian, Address } = connection.models;

// Marcadores para o teardown localizar as linhas que os testes de create gravam.
const PROBE_EMAIL = 'probe-create@test.local';
const PROBE_CPF = '99988877766';

beforeAll(async () => {
  await setupTestData();
});

afterEach(async () => {
  const probes = await Staff.findAll({ where: { email: PROBE_EMAIL } });
  for (const p of probes) {
    await Address.destroy({ where: { staff_id: p.id } });
  }
  await Staff.destroy({ where: { email: PROBE_EMAIL } });
  await Guardian.destroy({ where: { email: PROBE_EMAIL } });
  await resetFixtureStatuses();
});

afterAll(async () => {
  await teardownTestData();
  await connection.close();
});

const admin = () => cookieFor(testUser(LEVELS.SCHOOL_OFFICE));

function staffPayload(extra = {}) {
  return {
    full_name: 'Probe Staff',
    email: PROBE_EMAIL,
    cpf: PROBE_CPF,
    birth_date: '1990-01-01',
    phone: '11999998888',
    personal_email: 'probe-personal@test.local',
    job_title: 'Probe',
    hiring_date: '2020-01-01',
    ...extra,
  };
}

// O caminho de erro é o caminho de validação: sem o envelope, o formulário não
// tem como apontar o campo inválido.
describe('robustez — erro de validação devolve {errors}, não 500', () => {
  it('POST /staff inválido → 400 com os erros de campo', async () => {
    const res = await request(app)
      .post('/staff')
      .set('Cookie', admin())
      .send({ full_name: 'x' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('POST /guardians inválido → 400 com os erros de campo', async () => {
    const res = await request(app)
      .post('/guardians')
      .set('Cookie', admin())
      .send({ name: 'x' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('PUT /staff/:id inválido → 400 com os erros de campo', async () => {
    const res = await request(app)
      .put(`/staff/${ORDINARY_STAFF.id}`)
      .set('Cookie', admin())
      .send({ email: 'nao-e-email' });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});

// Sequelize ignora validador em valor null: sem allowNull no model, o null
// explícito só falharia no banco, e sob sql_mode relaxado viraria '' — no email,
// isso tranca o login.
describe('robustez — model reflete o NOT NULL do schema (users)', () => {
  it('PUT /users/:id {email: null} → 400, não 500', async () => {
    const res = await request(app)
      .put(`/users/${TEST_USERS[5].id}`)
      .set('Cookie', admin())
      .send({ email: null });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('PUT /users/:id {is_temporary: null} → 400, não 500', async () => {
    const res = await request(app)
      .put(`/users/${TEST_USERS[5].id}`)
      .set('Cookie', admin())
      .send({ is_temporary: null });

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});

// `staff.user_id` é o vínculo que avatarAuth lê para reconhecer o ator como
// staff; aceitá-lo no body permitiria forjar esse reconhecimento.
describe('robustez — create de ficha não aceita user_id', () => {
  it('POST /staff ignora user_id do body (ficha nasce sem conta)', async () => {
    const res = await request(app)
      .post('/staff')
      .set('Cookie', admin())
      .send(staffPayload({ user_id: TEST_USERS[1].id }));

    expect(res.status).toBe(201);

    const created = await Staff.findOne({ where: { email: PROBE_EMAIL } });
    expect(created).toBeTruthy();
    expect(created.user_id).toBeNull();
  });

  it('POST /staff ignora id do body (não dá para escolher a chave)', async () => {
    const res = await request(app)
      .post('/staff')
      .set('Cookie', admin())
      .send(staffPayload({ id: 9500 }));

    expect(res.status).toBe(201);

    const created = await Staff.findOne({ where: { email: PROBE_EMAIL } });
    expect(created.id).not.toBe(9500);
  });
});

// A entidade dona do endereço é imposta pelo controller; o body não a escolhe.
describe('robustez — endereço não aceita coluna arbitrária', () => {
  it('POST /staff não deixa o address injetar student_id', async () => {
    const res = await request(app)
      .post('/staff')
      .set('Cookie', admin())
      .send(
        staffPayload({
          addresses: [
            {
              zip_code: '11111-000',
              street: 'Probe',
              number: '1',
              neighborhood: 'Centro',
              city: 'Rio de Janeiro',
              state: 'RJ',
              student_id: 9301,
            },
          ],
        }),
      );

    expect(res.status).toBe(201);

    const created = await Staff.findOne({ where: { email: PROBE_EMAIL } });
    const addr = await Address.findOne({ where: { staff_id: created.id } });
    expect(addr).toBeTruthy();
    expect(addr.student_id).toBeNull();
  });
});
