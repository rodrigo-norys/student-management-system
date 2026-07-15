import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';

import app from '../src/app.js';
import connection from '../src/database/index.js';
import loginRequired from '../src/middlewares/loginRequired.js';

import { setupTestData, teardownTestData, testUser } from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

const ROLEAUTH_FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';
const DEMO_READONLY = 'Demo mode is read-only.';

beforeAll(async () => {
  await setupTestData();
});

afterAll(async () => {
  await teardownTestData();
  await connection.close();
});

// Mini-app isolado para exercitar loginRequired diretamente (sem roleAuth das
// rotas reais interferindo). O handler ecoa req.* para provar a população.
function buildProbeApp() {
  const probe = express();
  probe.use(cookieParser());
  probe.use(express.json());
  const echo = (req, res) =>
    res.json({
      userId: req.userId,
      userWeight: req.userWeight,
      userRole: req.userRole,
      userPermissions: req.userPermissions,
    });
  probe.get('/probe', loginRequired, echo);
  probe.post('/probe', loginRequired, echo);
  return probe;
}

describe('loginRequired', () => {
  const probe = buildProbeApp();

  it('401 sem cookie', async () => {
    const res = await request(probe).get('/probe');
    expect(res.status).toBe(401);
    expect(res.body.errors).toContain('Login required.');
  });

  it('401 token inválido', async () => {
    const res = await request(probe)
      .get('/probe')
      .set('Cookie', ['access_token=not-a-jwt']);
    expect(res.status).toBe(401);
    expect(res.body.errors).toContain('Token expired or invalid.');
  });

  it('401 token expirado', async () => {
    const res = await request(probe)
      .get('/probe')
      .set(
        'Cookie',
        cookieFor(testUser(LEVELS.GENERAL_DIRECTOR), { expiresIn: -10 }),
      );
    expect(res.status).toBe(401);
    expect(res.body.errors).toContain('Token expired or invalid.');
  });

  it('401 token de user inexistente', async () => {
    const res = await request(probe)
      .get('/probe')
      .set('Cookie', cookieFor({ id: 999999, email: 'ghost@test.local' }));
    expect(res.status).toBe(401);
    expect(res.body.errors).toContain('User not found or inactive.');
  });

  it('popula req.* para General Director (nível 1)', async () => {
    const res = await request(probe)
      .get('/probe')
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));
    expect(res.status).toBe(200);
    expect(res.body.userWeight).toBe(100);
    expect(res.body.userRole).toBe('General Director');
    expect(res.body.userPermissions.manage_account).toBeTruthy();
    expect(res.body.userPermissions.manage_record).toBeTruthy();
  });

  it('popula req.* para Teacher (nível 5) sem flags de gestão', async () => {
    const res = await request(probe)
      .get('/probe')
      .set('Cookie', cookieFor(testUser(LEVELS.TEACHER)));
    expect(res.status).toBe(200);
    expect(res.body.userWeight).toBe(30);
    expect(res.body.userRole).toBe('Teacher');
    expect(res.body.userPermissions.manage_record).toBeFalsy();
    expect(res.body.userPermissions.manage_account).toBeFalsy();
  });

  it('demo trap: bloqueia não-GET no nível demo', async () => {
    const res = await request(probe)
      .post('/probe')
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(DEMO_READONLY);
  });

  it('demo trap: deixa passar GET no nível demo', async () => {
    const res = await request(probe)
      .get('/probe')
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(200);
    expect(res.body.userRole).toBe('Demo');
  });
});

describe('roleAuth manage_record — GET /staff e GET /guardians', () => {
  const allowed = [
    LEVELS.GENERAL_DIRECTOR,
    LEVELS.SCHOOL_OFFICE,
    LEVELS.FINANCE_ADMIN,
  ];
  const denied = [LEVELS.ACADEMIC_COORDINATOR, LEVELS.TEACHER, LEVELS.DEMO];

  for (const path of ['/staff', '/guardians']) {
    it.each(allowed)(`nível %i acessa GET ${path}`, async (level) => {
      const res = await request(app)
        .get(path)
        .set('Cookie', cookieFor(testUser(level)));
      expect(res.status).toBe(200);
    });

    it.each(denied)(`nível %i é barrado em GET ${path}`, async (level) => {
      const res = await request(app)
        .get(path)
        .set('Cookie', cookieFor(testUser(level)));
      expect(res.status).toBe(403);
      expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
    });
  }
});

// Era manage_account enquanto o delete da ficha cascateava na conta. Com o
// cascade desacoplado, deletar ficha não toca conta nenhuma — virou operação de
// cadastro, e o Finance Admin (manage_record, sem manage_account) passa a
// alcançá-la. A conta em si segue exigindo manage_account em DELETE /users/:id.
describe('roleAuth manage_record — DELETE /staff/:id e DELETE /guardians/:id', () => {
  const allowed = [
    LEVELS.GENERAL_DIRECTOR,
    LEVELS.SCHOOL_OFFICE,
    LEVELS.FINANCE_ADMIN,
  ];
  // DEMO fica fora: DELETE é não-GET → cai no trap (mensagem diferente),
  // coberto na suíte do trap.
  const denied = [LEVELS.ACADEMIC_COORDINATOR, LEVELS.TEACHER];
  const cases = [
    { path: '/staff/999999', notFound: 'Staff member not found.' },
    { path: '/guardians/999999', notFound: 'Guardian not found.' },
  ];

  for (const { path, notFound } of cases) {
    it.each(allowed)(
      `nível %i passa o guard em DELETE ${path} (404, sem mutar)`,
      async (level) => {
        const res = await request(app)
          .delete(path)
          .set('Cookie', cookieFor(testUser(level)));
        expect(res.status).toBe(404);
        expect(res.body.errors).toContain(notFound);
      },
    );

    it.each(denied)(`nível %i é barrado em DELETE ${path}`, async (level) => {
      const res = await request(app)
        .delete(path)
        .set('Cookie', cookieFor(testUser(level)));
      expect(res.status).toBe(403);
      expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
    });
  }
});

describe('roleAuth manage_record — PATCH /avatar/:userType/:id', () => {
  const allowed = [
    LEVELS.GENERAL_DIRECTOR,
    LEVELS.SCHOOL_OFFICE,
    LEVELS.FINANCE_ADMIN,
  ];
  const denied = [LEVELS.ACADEMIC_COORDINATOR, LEVELS.TEACHER];

  it.each(allowed)(
    'nível %i passa o guard (400 File is required)',
    async (level) => {
      const res = await request(app)
        .patch('/avatar/staff/999999')
        .set('Cookie', cookieFor(testUser(level)));
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('File is required.');
    },
  );

  it.each(denied)('nível %i é barrado', async (level) => {
    const res = await request(app)
      .patch('/avatar/staff/999999')
      .set('Cookie', cookieFor(testUser(level)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });
});

describe('demo read-only trap — ordem no app real', () => {
  it('POST /staff no nível demo → trap dispara antes do roleAuth', async () => {
    const res = await request(app)
      .post('/staff')
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)))
      .send({});
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(DEMO_READONLY);
  });

  it('GET /staff no nível demo → passa o trap e cai no roleAuth', async () => {
    const res = await request(app)
      .get('/staff')
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(ROLEAUTH_FORBIDDEN);
  });

  it('DELETE /guardians/:id no nível demo → trap', async () => {
    const res = await request(app)
      .delete('/guardians/999999')
      .set('Cookie', cookieFor(testUser(LEVELS.DEMO)));
    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(DEMO_READONLY);
  });
});
