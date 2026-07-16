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

// Literais de propósito: assert em cima da mensagem do módulo sob teste viraria
// tautologia.
const FORBIDDEN =
  'Forbidden. You do not have permission to access this resource.';
// Passar o guard sem mandar arquivo para no 400 do controller — é o sinal de que
// a AUTORIZAÇÃO liberou, sem precisar subir upload de verdade em teste.
const PASSED_GUARD = 'File is required.';

beforeAll(async () => {
  await setupTestData();
});

afterAll(async () => {
  await teardownTestData();
  await connection.close();
});

// Matriz travada pelo dono: terceiro exige manage_account (= só GD e School
// Office); o próprio avatar é livre para QUALQUER staff. Student/Guardian não
// trocam nem o próprio — o único self permitido é o de staff, e ter linha em
// `staff` é justamente a prova de que o ator é staff (não existe flag que
// distinga staff de student/guardian: Security(6), Student(7) e Guardian(8) têm
// as quatro manage_* zeradas).
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

  // A premissa load-bearing do módulo, em um par: Security(6) e Student(7) têm
  // as quatro manage_* zeradas — flags IDÊNTICAS. O que separa um do outro é só
  // a linha em `staff`. Se essa premissa cair, os dois casos divergem aqui.
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

  // Combinação que só existe porque o cascade foi desacoplado: a ficha caiu no
  // soft delete mas a conta segue ativa, então o desligado ainda loga. O self
  // exige ficha ATIVA, não só login válido.
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

  // O alvo é a ficha do SEGUNDO diretor — de terceiro para todos os atores.
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

  // Finance Admin PERDE o avatar de terceiro nesta fatia (antes a rota era
  // manage_record, que ele tem). É a consequência assumida da matriz.
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

// PUT /staff é manage_record e grava na mesma coluna que o AvatarController.
// Aceitar avatar_url ali daria ao Finance Admin, por outra porta, o avatar de
// terceiro que a matriz lhe nega.
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

  // Sem self em `users`: senão um Student trocaria o avatar da própria conta,
  // furando a regra pela porta lateral.
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
