import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/index.js';

import {
  setupTestData,
  teardownTestData,
  resetFixtureStatuses,
  statusOf,
  accessLevelOf,
  testUser,
  SECOND_DIRECTOR,
  DISPOSABLE_USER,
  DISPOSABLE_PEER,
  DIRECTOR_STAFF,
  DIRECTOR_GUARDIAN,
  DIRECTOR_STUDENT,
  ORDINARY_STAFF,
  ORDINARY_GUARDIAN,
  ORPHAN_STAFF,
} from './helpers/db.js';
import { cookieFor, LEVELS } from './helpers/auth.js';

// Literal de propósito: se viesse do módulo sob teste, o assert viraria
// tautologia e um 403 vindo do peso passaria por 403 vindo da guarda.
const PROTECTED_TARGET =
  'Forbidden. The General Director cannot be deactivated.';
const SELF_DEACTIVATION = 'Forbidden. You cannot deactivate your own account.';

beforeAll(async () => {
  await setupTestData();
});

afterEach(async () => {
  await resetFixtureStatuses();
});

afterAll(async () => {
  await teardownTestData();
  await connection.close();
});

describe('política de delete — alvo nível 1 (General Director) é intocável', () => {
  it('DELETE /users/:id — nem outro General Director o desativa', async () => {
    const res = await request(app)
      .delete(`/users/${SECOND_DIRECTOR.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('User', SECOND_DIRECTOR.id)).toBe('active');
  });

  // O ator aqui é outro General Director de propósito. Um nível 2 já seria
  // barrado pelo peso (80 < 100), e o teste passaria sem a guarda existir; só
  // o peso-100 atravessa a paridade e deixa a guarda ser a única coisa de pé.
  it('DELETE /staff/:id — nem um GD derruba o registro (e a conta) de outro GD', async () => {
    const res = await request(app)
      .delete(`/staff/${DIRECTOR_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('Staff', DIRECTOR_STAFF.id)).toBe('active');
    expect(await statusOf('User', DIRECTOR_STAFF.user_id)).toBe('active');
  });

  it('DELETE /guardians/:id — nem um GD derruba o registro (e a conta) de outro GD', async () => {
    const res = await request(app)
      .delete(`/guardians/${DIRECTOR_GUARDIAN.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('Guardian', DIRECTOR_GUARDIAN.id)).toBe('active');
    expect(await statusOf('User', DIRECTOR_GUARDIAN.user_id)).toBe('active');
  });

  it('DELETE /students/:id — nem um GD derruba o registro (e a conta) de outro GD', async () => {
    const res = await request(app)
      .delete(`/students/${DIRECTOR_STUDENT.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('Student', DIRECTOR_STUDENT.id)).toBe('active');
    expect(await statusOf('User', DIRECTOR_STUDENT.user_id)).toBe('active');
  });
});

// A vulnerabilidade literal que abriu esta fatia: antes da guarda, estes três
// respondiam 200 e cascateavam, desativando a conta do General Director.
describe('política de delete — regressão: ator subordinado não alcança o GD', () => {
  const cases = [
    { path: () => `/staff/${DIRECTOR_STAFF.id}`, actor: LEVELS.SCHOOL_OFFICE },
    {
      path: () => `/guardians/${DIRECTOR_GUARDIAN.id}`,
      actor: LEVELS.SCHOOL_OFFICE,
    },
    {
      path: () => `/students/${DIRECTOR_STUDENT.id}`,
      actor: LEVELS.FINANCE_ADMIN,
    },
  ];

  it.each(cases)(
    'DELETE $path → 403, conta do GD intacta',
    async ({ path, actor }) => {
      const res = await request(app)
        .delete(path())
        .set('Cookie', cookieFor(testUser(actor)));

      expect(res.status).toBe(403);
      expect(await statusOf('User', SECOND_DIRECTOR.id)).toBe('active');
    },
  );
});

describe('política de delete — update não é rota de fuga', () => {
  it('PUT /users/:id — o General Director não se auto-desativa', async () => {
    const gd = testUser(LEVELS.GENERAL_DIRECTOR);
    const res = await request(app)
      .put(`/users/${gd.id}`)
      .set('Cookie', cookieFor(gd))
      .send({ status: 'inactive' });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('User', gd.id)).toBe('active');
  });

  it('PUT /users/:id — ninguém desativa a própria conta pelo update', async () => {
    const self = testUser(LEVELS.SCHOOL_OFFICE);
    const res = await request(app)
      .put(`/users/${self.id}`)
      .set('Cookie', cookieFor(self))
      .send({ status: 'inactive' });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(SELF_DEACTIVATION);
    expect(await statusOf('User', self.id)).toBe('active');
  });

  // O rebaixamento era o irmão gêmeo do auto-brick: sem status nenhum, o GD se
  // move para o nível 3, perde a proteção (que é chaveada no nível) e cai na
  // paridade de peso — um par 80 então o desativa pelo delete normal.
  it('PUT /users/:id — o General Director não se auto-rebaixa', async () => {
    const gd = testUser(LEVELS.GENERAL_DIRECTOR);
    const res = await request(app)
      .put(`/users/${gd.id}`)
      .set('Cookie', cookieFor(gd))
      .send({ access_level_id: LEVELS.FINANCE_ADMIN });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await accessLevelOf(gd.id)).toBe(LEVELS.GENERAL_DIRECTOR);
  });

  // Mesma classe do null abaixo, no outro campo: '' é falsy e escapava das três
  // guardas. Sem isto, quem barraria seria só o sql_mode estrito do MariaDB —
  // um invariante de auth apoiado em config de banco.
  it('PUT /users/:id — status falsy não escapa da guarda', async () => {
    const gd = testUser(LEVELS.GENERAL_DIRECTOR);
    const res = await request(app)
      .put(`/users/${gd.id}`)
      .set('Cookie', cookieFor(gd))
      .send({ status: '' });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('User', gd.id)).toBe('active');
  });

  // null é falsy: escapava da guarda por truthiness e levava o nível a NULL em
  // vez de rebaixá-lo. Pior que rebaixar — loginRequired lê o peso sem optional
  // chaining, então a conta passa a tomar 401 em toda rota autenticada.
  it('PUT /users/:id — o General Director não anula o próprio nível', async () => {
    const gd = testUser(LEVELS.GENERAL_DIRECTOR);
    const res = await request(app)
      .put(`/users/${gd.id}`)
      .set('Cookie', cookieFor(gd))
      .send({ access_level_id: null });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await accessLevelOf(gd.id)).toBe(LEVELS.GENERAL_DIRECTOR);
  });

  it('PUT /users/:id — anular o nível é recusado para qualquer conta', async () => {
    const self = testUser(LEVELS.SCHOOL_OFFICE);
    const res = await request(app)
      .put(`/users/${self.id}`)
      .set('Cookie', cookieFor(self))
      .send({ access_level_id: null });

    expect(res.status).toBe(403);
    expect(await accessLevelOf(self.id)).toBe(LEVELS.SCHOOL_OFFICE);
  });

  // Sem assert de mensagem: aqui quem barra é o check de autoridade de edição
  // (peso estrito, 100 <= 100), que já existia e dispara antes da guarda. O que
  // importa travar é a propriedade — o nível do GD não se move —, não qual das
  // duas defesas em profundidade respondeu.
  it('PUT /users/:id — nem outro GD rebaixa o General Director', async () => {
    const res = await request(app)
      .put(`/users/${SECOND_DIRECTOR.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)))
      .send({ access_level_id: LEVELS.FINANCE_ADMIN });

    expect(res.status).toBe(403);
    expect(await accessLevelOf(SECOND_DIRECTOR.id)).toBe(
      LEVELS.GENERAL_DIRECTOR,
    );
  });

  it('PUT /users/:id — edição legítima do próprio perfil segue passando', async () => {
    const self = testUser(LEVELS.SCHOOL_OFFICE);
    const res = await request(app)
      .put(`/users/${self.id}`)
      .set('Cookie', cookieFor(self))
      .send({ avatar_url: 'avatar-updated.png' });

    expect(res.status).toBe(200);
    expect(await statusOf('User', self.id)).toBe('active');
  });
});

describe('política de delete — paridade de peso', () => {
  it('DELETE /users/:id — nível 2 desativa nível 3 (mesmo peso 80)', async () => {
    const res = await request(app)
      .delete(`/users/${DISPOSABLE_USER.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)));

    expect(res.status).toBe(200);
    expect(await statusOf('User', DISPOSABLE_USER.id)).toBe('inactive');
  });

  // Consequência assumida da paridade: peso igual é peso igual, então pares se
  // removem entre si. Decisão do dono — hierarquia interna de cargo, quando
  // existir, vira access_level própria (peso menor), não regra nova aqui.
  it('DELETE /users/:id — nível 2 desativa outro nível 2 (pares)', async () => {
    const res = await request(app)
      .delete(`/users/${DISPOSABLE_PEER.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)));

    expect(res.status).toBe(200);
    expect(await statusOf('User', DISPOSABLE_PEER.id)).toBe('inactive');
  });
});

describe('política de delete — guardas e caminho legítimo preservados', () => {
  it('DELETE /users/:id — self-delete continua barrado', async () => {
    const self = testUser(LEVELS.SCHOOL_OFFICE);
    const res = await request(app)
      .delete(`/users/${self.id}`)
      .set('Cookie', cookieFor(self));

    expect(res.status).toBe(403);
    expect(await statusOf('User', self.id)).toBe('active');
  });

  it('DELETE /staff/:id — registro de conta comum segue desativável', async () => {
    const res = await request(app)
      .delete(`/staff/${ORDINARY_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)));

    expect(res.status).toBe(200);
    expect(await statusOf('Staff', ORDINARY_STAFF.id)).toBe('inactive');
  });

  it('DELETE /guardians/:id — registro de conta comum segue desativável', async () => {
    const res = await request(app)
      .delete(`/guardians/${ORDINARY_GUARDIAN.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)));

    expect(res.status).toBe(200);
    expect(await statusOf('Guardian', ORDINARY_GUARDIAN.id)).toBe('inactive');
  });

  it('DELETE /staff/:id — registro sem conta vinculada não tem hierarquia a violar', async () => {
    const res = await request(app)
      .delete(`/staff/${ORPHAN_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)));

    expect(res.status).toBe(200);
    expect(await statusOf('Staff', ORPHAN_STAFF.id)).toBe('inactive');
  });
});
