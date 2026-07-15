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
  setStatus,
  userIdOf,
  testUser,
  SECOND_DIRECTOR,
  DISPOSABLE_USER,
  DISPOSABLE_PEER,
  DIRECTOR_STAFF,
  DIRECTOR_GUARDIAN,
  DIRECTOR_STUDENT,
  ORDINARY_STAFF,
  ORDINARY_GUARDIAN,
  ORDINARY_STUDENT,
  ORPHAN_STAFF,
  CASCADE_USER,
  CASCADE_STAFF,
  CASCADE_GUARDIAN,
  CASCADE_STUDENT,
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

// Modo 1 — soft delete por entidade. Cada rota mexe só no SEU registro, nos
// dois sentidos: desativar a ficha não derruba a conta, e desativar a conta não
// derruba a ficha. Todo cascade nasce no User, e só sob pedido explícito.
describe('política de delete — cascade desacoplado', () => {
  const officeCookie = () => cookieFor(testUser(LEVELS.SCHOOL_OFFICE));

  it('DELETE /staff/:id — desativa a ficha, a conta segue ativa', async () => {
    const res = await request(app)
      .delete(`/staff/${ORDINARY_STAFF.id}`)
      .set('Cookie', officeCookie());

    expect(res.status).toBe(200);
    expect(await statusOf('Staff', ORDINARY_STAFF.id)).toBe('inactive');
    expect(await statusOf('User', ORDINARY_STAFF.user_id)).toBe('active');
  });

  it('DELETE /guardians/:id — desativa a ficha, a conta segue ativa', async () => {
    const res = await request(app)
      .delete(`/guardians/${ORDINARY_GUARDIAN.id}`)
      .set('Cookie', officeCookie());

    expect(res.status).toBe(200);
    expect(await statusOf('Guardian', ORDINARY_GUARDIAN.id)).toBe('inactive');
    expect(await statusOf('User', ORDINARY_GUARDIAN.user_id)).toBe('active');
  });

  it('DELETE /students/:id — desativa a ficha, a conta segue ativa', async () => {
    const res = await request(app)
      .delete(`/students/${ORDINARY_STUDENT.id}`)
      .set('Cookie', officeCookie());

    expect(res.status).toBe(200);
    expect(await statusOf('Student', ORDINARY_STUDENT.id)).toBe('inactive');
    expect(await statusOf('User', ORDINARY_STUDENT.user_id)).toBe('active');
  });

  it('DELETE /users/:id — desativa a conta, as fichas seguem ativas', async () => {
    const res = await request(app)
      .delete(`/users/${CASCADE_USER.id}`)
      .set('Cookie', officeCookie());

    expect(res.status).toBe(200);
    expect(await statusOf('User', CASCADE_USER.id)).toBe('inactive');
    expect(await statusOf('Staff', CASCADE_STAFF.id)).toBe('active');
    expect(await statusOf('Guardian', CASCADE_GUARDIAN.id)).toBe('active');
    expect(await statusOf('Student', CASCADE_STUDENT.id)).toBe('active');
  });
});

// Modo 2 — soft delete em cascade. Opt-in explícito, e só a partir do User.
describe('política de delete — cascade explícito no User', () => {
  const officeCookie = () => cookieFor(testUser(LEVELS.SCHOOL_OFFICE));

  it('DELETE /users/:id?cascade=true — derruba a conta e as três fichas', async () => {
    const res = await request(app)
      .delete(`/users/${CASCADE_USER.id}?cascade=true`)
      .set('Cookie', officeCookie());

    expect(res.status).toBe(200);
    expect(res.body.cascade).toBe(true);
    expect(await statusOf('User', CASCADE_USER.id)).toBe('inactive');
    expect(await statusOf('Staff', CASCADE_STAFF.id)).toBe('inactive');
    expect(await statusOf('Guardian', CASCADE_GUARDIAN.id)).toBe('inactive');
    expect(await statusOf('Student', CASCADE_STUDENT.id)).toBe('inactive');
  });

  // O default é o modo seguro: só 'true' exato cascateia. Qualquer outra coisa
  // — inclusive um 'false' textual ou lixo — cai no soft delete da conta.
  it.each(['false', '1', 'yes', ''])(
    'DELETE /users/:id?cascade=%s — não cascateia',
    async (value) => {
      const res = await request(app)
        .delete(`/users/${CASCADE_USER.id}?cascade=${value}`)
        .set('Cookie', officeCookie());

      expect(res.status).toBe(200);
      expect(res.body.cascade).toBe(false);
      expect(await statusOf('User', CASCADE_USER.id)).toBe('inactive');
      expect(await statusOf('Staff', CASCADE_STAFF.id)).toBe('active');
    },
  );

  it('a guarda de nível-1 vale também no cascade', async () => {
    const res = await request(app)
      .delete(`/users/${SECOND_DIRECTOR.id}?cascade=true`)
      .set('Cookie', cookieFor(testUser(LEVELS.GENERAL_DIRECTOR)));

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('User', SECOND_DIRECTOR.id)).toBe('active');
    expect(await statusOf('Staff', DIRECTOR_STAFF.id)).toBe('active');
  });

  // Cascade não achata ciclo de vida: só desativa fichas 'active'. Um aluno
  // formado vinculado à conta continua graduated.
  it('cascade preserva status não-ativo (graduated)', async () => {
    await setStatus('Student', CASCADE_STUDENT.id, 'graduated');

    const res = await request(app)
      .delete(`/users/${CASCADE_USER.id}?cascade=true`)
      .set('Cookie', officeCookie());

    expect(res.status).toBe(200);
    expect(await statusOf('User', CASCADE_USER.id)).toBe('inactive');
    expect(await statusOf('Staff', CASCADE_STAFF.id)).toBe('inactive');
    expect(await statusOf('Student', CASCADE_STUDENT.id)).toBe('graduated');
  });
});

// O invariante que sustenta a mudança de flag: DELETE de ficha virou
// manage_record (Finance Admin alcança), mas a CONTA segue exigindo
// manage_account. Sem estes casos, trocar a flag de /users passaria despercebido.
describe('política de delete — fronteira da flag (manage_record ≠ conta)', () => {
  const financeCookie = () => cookieFor(testUser(LEVELS.FINANCE_ADMIN));

  it('DELETE /staff/:id — Finance Admin (manage_record) desativa ficha', async () => {
    const res = await request(app)
      .delete(`/staff/${ORDINARY_STAFF.id}`)
      .set('Cookie', financeCookie());

    expect(res.status).toBe(200);
    expect(await statusOf('Staff', ORDINARY_STAFF.id)).toBe('inactive');
  });

  it('DELETE /users/:id — Finance Admin NÃO desativa conta (falta manage_account)', async () => {
    const res = await request(app)
      .delete(`/users/${DISPOSABLE_USER.id}`)
      .set('Cookie', financeCookie());

    expect(res.status).toBe(403);
    expect(await statusOf('User', DISPOSABLE_USER.id)).toBe('active');
  });

  it('DELETE /users/:id?cascade=true — Finance Admin barrado antes de cascatear', async () => {
    const res = await request(app)
      .delete(`/users/${CASCADE_USER.id}?cascade=true`)
      .set('Cookie', financeCookie());

    expect(res.status).toBe(403);
    expect(await statusOf('User', CASCADE_USER.id)).toBe('active');
    expect(await statusOf('Staff', CASCADE_STAFF.id)).toBe('active');
  });
});

// O PUT não pode ser a porta dos fundos da guarda do delete. Mesma classe de
// bug já fechada no UserController.update, agora nas fichas.
describe('política de delete — PUT de ficha não contorna a guarda', () => {
  it('PUT /staff/:id — não desativa a ficha do GD por status direto', async () => {
    const res = await request(app)
      .put(`/staff/${DIRECTOR_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)))
      .send({ status: 'inactive' });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('Staff', DIRECTOR_STAFF.id)).toBe('active');
  });

  it('PUT /guardians/:id — não desativa a ficha do GD por status direto', async () => {
    const res = await request(app)
      .put(`/guardians/${DIRECTOR_GUARDIAN.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)))
      .send({ status: 'inactive' });

    expect(res.status).toBe(403);
    expect(res.body.errors).toContain(PROTECTED_TARGET);
    expect(await statusOf('Guardian', DIRECTOR_GUARDIAN.id)).toBe('active');
  });

  // O caminho de 2 passos: orfanar a ficha para a guarda perder a referência.
  it('PUT /staff/:id — user_id não é editável (mata a rota órfã + delete)', async () => {
    const before = await userIdOf('Staff', DIRECTOR_STAFF.id);

    const putRes = await request(app)
      .put(`/staff/${DIRECTOR_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.FINANCE_ADMIN)))
      .send({ user_id: null, full_name: 'Renamed Fixture' });

    expect(putRes.status).toBe(200);
    expect(await userIdOf('Staff', DIRECTOR_STAFF.id)).toBe(before);

    const delRes = await request(app)
      .delete(`/staff/${DIRECTOR_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.FINANCE_ADMIN)));

    expect(delRes.status).toBe(403);
    expect(await statusOf('Staff', DIRECTOR_STAFF.id)).toBe('active');
  });

  it('PUT /staff/:id — subordinado não desativa a ficha de superior', async () => {
    // Teacher (peso 30) tenta desativar a ficha de outro Teacher via peso? Não —
    // aqui o alvo é a ficha do GD (peso 100) e o ator é School Office (80).
    const res = await request(app)
      .put(`/staff/${DIRECTOR_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)))
      .send({ status: 'suspended' });

    expect(res.status).toBe(403);
    expect(await statusOf('Staff', DIRECTOR_STAFF.id)).toBe('active');
  });

  it('PUT /staff/:id — edição legítima de cadastro segue passando', async () => {
    const res = await request(app)
      .put(`/staff/${ORDINARY_STAFF.id}`)
      .set('Cookie', cookieFor(testUser(LEVELS.SCHOOL_OFFICE)))
      .send({ job_title: 'Updated Role' });

    expect(res.status).toBe(200);
    expect(await statusOf('Staff', ORDINARY_STAFF.id)).toBe('active');
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
