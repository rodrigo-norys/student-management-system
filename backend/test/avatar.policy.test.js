import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';

import {
  setupTestData,
  teardownTestData,
  testUser,
  ORDINARY_STAFF,
  FINANCE_STAFF,
  SECURITY_STAFF,
  INACTIVE_STAFF,
  DIRECTOR_STAFF,
  ORDINARY_GUARDIAN,
  SELF_STUDENT,
  SELF_GUARDIAN,
} from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

// Literais, não importados do módulo sob teste.
const FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';
// Sem arquivo no corpo, quem passa a autorização para no 400 do controller —
// o que dispensa upload real para exercitar a matriz.
const PASSED_GUARD = 'File is required.';

beforeAll(async () => {
  await setupTestData();
});

afterAll(async () => {
  await teardownTestData();
  await connection.close();
});

// Matriz: avatar de terceiro exige manage_account; o próprio é livre para
// qualquer staff; Student e Guardian não trocam nem o próprio.
describe('política de avatar — staff troca o PRÓPRIO (sem precisar de flag)', () => {
  it('Teacher (nível 5, sem flags) troca o próprio avatar', async () => {
    const res = await request(app)
      .patch(`/avatar/staff/${ORDINARY_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.TEACHER)));

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(PASSED_GUARD);
  });

  it('Finance Admin (nível 3, sem manage_account) troca o próprio avatar', async () => {
    const res = await request(app)
      .patch(`/avatar/staff/${FINANCE_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.FINANCE_ADMIN)));

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(PASSED_GUARD);
  });

  // Security(6) e Student(7) têm flags idênticas; só a linha em `staff` os
  // separa. Este caso e o do Student formam o par que trava essa premissa.
  it('Security/Front Desk (nível 6, flags idênticas às do Student) troca o próprio', async () => {
    const res = await request(app)
      .patch(`/avatar/staff/${SECURITY_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SECURITY)));

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(PASSED_GUARD);
  });

  it('Security/Front Desk é barrado no avatar de staff de terceiro', async () => {
    const res = await request(app)
      .patch(`/avatar/staff/${DIRECTOR_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SECURITY)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(FORBIDDEN);
  });

  // Ficha desativada convive com login válido: o self exige ficha ativa, não só
  // sessão.
  it('staff com ficha desligada (inactive) não troca o próprio avatar', async () => {
    const res = await request(app)
      .patch(`/avatar/staff/${INACTIVE_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.ACADEMIC_COORDINATOR)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(FORBIDDEN);
  });
});

describe('política de avatar — terceiro exige manage_account', () => {
  const withAccount = [LEVELS.GENERAL_DIRECTOR, LEVELS.SCHOOL_OFFICE];
  const withoutAccount = [
    LEVELS.FINANCE_ADMIN,
    LEVELS.ACADEMIC_COORDINATOR,
    LEVELS.TEACHER,
  ];

  // A ficha do segundo diretor é de terceiro para todos os atores.
  it.each(withAccount)(
    'nível %i troca avatar de staff de terceiro',
    async (level) => {
      const res = await request(app)
        .patch(`/avatar/staff/${DIRECTOR_STAFF.id}`)
        .set('Cookie', cookieFor(testUser(level)));

      expect(res.status).toBe(400);
      expect(res.body.errors).toContain(PASSED_GUARD);
    },
  );

  it.each(withoutAccount)(
    'nível %i é barrado no avatar de staff de terceiro',
    async (level) => {
      const res = await request(app)
        .patch(`/avatar/staff/${DIRECTOR_STAFF.id}`)
        .set('Cookie', cookieFor(testUser(level)));

      expect(res.status).toBe(403);
      expect(res.body.errors).toContain(FORBIDDEN);
    },
  );

  // Finance Admin tem manage_record mas não manage_account.
  it('Finance Admin é barrado em avatar de student e de guardian', async () => {
    for (const path of [
      `/avatar/students/${SELF_STUDENT.id}`,
      `/avatar/guardians/${SELF_GUARDIAN.id}`,
    ]) {
      const res = await request(app)
        .patch(path)
        .set('Cookie', cookieFor(testUser(LEVELS.FINANCE_ADMIN)));

      expect(res.status).toBe(403);
    }
  });

  it.each(withAccount)(
    'nível %i gerencia avatar de student e de guardian',
    async (level) => {
      for (const path of [
        `/avatar/students/${SELF_STUDENT.id}`,
        `/avatar/guardians/${SELF_GUARDIAN.id}`,
      ]) {
        const res = await request(app)
          .patch(path)
          .set('Cookie', cookieFor(testUser(level)));

        expect(res.status).toBe(400);
        expect(res.body.errors).toContain(PASSED_GUARD);
      }
    },
  );
});

describe('política de avatar — Student/Guardian não trocam nem o próprio', () => {
  it('Student (nível 7) é barrado na própria ficha', async () => {
    const res = await request(app)
      .patch(`/avatar/students/${SELF_STUDENT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.STUDENT)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(FORBIDDEN);
  });

  it('Guardian (nível 8) é barrado na própria ficha', async () => {
    const res = await request(app)
      .patch(`/avatar/guardians/${SELF_GUARDIAN.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GUARDIAN)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(FORBIDDEN);
  });
});

// PUT /staff é manage_record e grava na mesma coluna que o AvatarController;
// aceitar avatar_url ali contornaria a matriz.
describe('política de avatar — PUT de ficha não escreve avatar', () => {
  it('PUT /staff/:id ignora avatar_url do body', async () => {
    const before = await connection.models.Staff.findByPk(ORDINARY_STAFF.id);

    const res = await request(app)
      .put(`/staff/${ORDINARY_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.FINANCE_ADMIN)))
      .send({ avatar_url: 'injetado.jpg' });

    expect(res.status).toBe(200);

    const after = await connection.models.Staff.findByPk(ORDINARY_STAFF.id);
    expect(after.avatar_url).toBe(before.avatar_url);
  });

  it('PUT /guardians/:id ignora avatar_url do body', async () => {
    const before = await connection.models.Guardian.findByPk(
      ORDINARY_GUARDIAN.id,
    );

    const res = await request(app)
      .put(`/guardians/${ORDINARY_GUARDIAN.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.FINANCE_ADMIN)))
      .send({ avatar_url: 'injetado.jpg' });

    expect(res.status).toBe(200);

    const after = await connection.models.Guardian.findByPk(
      ORDINARY_GUARDIAN.id,
    );
    expect(after.avatar_url).toBe(before.avatar_url);
  });
});

describe('política de avatar — userType=users é só manage_account', () => {
  it('GD passa o guard no avatar de conta', async () => {
    const gd = testUser(LEVELS.GENERAL_DIRECTOR);
    const res = await request(app)
      .patch(`/avatar/users/${gd.id}`)
      .set('Cookie', cookieFor(gd));

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain(PASSED_GUARD);
  });

  // Sem self em `users`: um Student trocaria o avatar da própria conta.
  it('Teacher é barrado no avatar da PRÓPRIA conta', async () => {
    const teacher = testUser(LEVELS.TEACHER);
    const res = await request(app)
      .patch(`/avatar/users/${teacher.id}`)
      .set('Cookie', cookieFor(teacher));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(FORBIDDEN);
  });

  it('Student é barrado no avatar da PRÓPRIA conta', async () => {
    const student = testUser(LEVELS.STUDENT);
    const res = await request(app)
      .patch(`/avatar/users/${student.id}`)
      .set('Cookie', cookieFor(student));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(FORBIDDEN);
  });
});
