import connection from '../../src/database/index.js';

const { User, AccessLevel, Staff, Guardian, Student } = connection.models;

const DEMO_LEVEL_ID = Number(process.env.DEMO_LEVEL_ID) || 99;

// Um user active por nível relevante para os guards. Ids acima de 9000 para não
// colidir com dados de produção/seed e permitir teardown por range.
export const TEST_USERS = {
  1: { id: 9001, email: 'lvl1@test.local' },
  2: { id: 9002, email: 'lvl2@test.local' },
  3: { id: 9003, email: 'lvl3@test.local' },
  4: { id: 9004, email: 'lvl4@test.local' },
  5: { id: 9005, email: 'lvl5@test.local' },
  [DEMO_LEVEL_ID]: { id: 9099, email: 'lvl99@test.local' },
};

// Segundo General Director: alvo da guarda de nível-1. O 9001 não serve como
// alvo porque ele é o ator, e o self-guard dispararia antes da guarda.
export const SECOND_DIRECTOR = {
  id: 9011,
  email: 'lvl1-b@test.local',
  access_level_id: 1,
};

// Alvos descartáveis do caminho feliz: são eles que levam o soft delete,
// deixando os TEST_USERS intactos para as outras suítes. O nível 3 cobre a
// paridade 2→3; o segundo nível 2 cobre a paridade entre pares (2→2).
export const DISPOSABLE_USER = {
  id: 9010,
  email: 'lvl3-disposable@test.local',
  access_level_id: 3,
};

export const DISPOSABLE_PEER = {
  id: 9012,
  email: 'lvl2-disposable@test.local',
  access_level_id: 2,
};

// Registros vinculados à conta de um General Director. Apontam para o SEGUNDO
// diretor de propósito: se apontassem para o 9001 — o ator dos testes — o
// self-guard dispararia antes e a guarda de nível nunca seria exercitada.
export const DIRECTOR_STAFF = { id: 9101, user_id: SECOND_DIRECTOR.id };
export const DIRECTOR_GUARDIAN = { id: 9201, user_id: SECOND_DIRECTOR.id };
export const DIRECTOR_STUDENT = { id: 9301, user_id: SECOND_DIRECTOR.id };

// Registros vinculados a contas comuns: provam que a guarda barra só o nível 1
// e não quebrou o delete legítimo.
export const ORDINARY_STAFF = { id: 9102, user_id: TEST_USERS[5].id };
export const ORDINARY_GUARDIAN = { id: 9202, user_id: TEST_USERS[4].id };

// Registro sem conta vinculada: cobre o ramo "alvo sem hierarquia" da guarda.
export const ORPHAN_STAFF = { id: 9103, user_id: null };

const userIds = [
  ...Object.values(TEST_USERS).map((u) => u.id),
  SECOND_DIRECTOR.id,
  DISPOSABLE_USER.id,
  DISPOSABLE_PEER.id,
];
const staffIds = [DIRECTOR_STAFF.id, ORDINARY_STAFF.id, ORPHAN_STAFF.id];
const guardianIds = [DIRECTOR_GUARDIAN.id, ORDINARY_GUARDIAN.id];
const studentIds = [DIRECTOR_STUDENT.id];

export function testUser(levelId) {
  return TEST_USERS[levelId];
}

function staffRow({ id, user_id }) {
  return {
    id,
    user_id,
    full_name: `Staff Fixture ${id}`,
    email: `staff${id}@test.local`,
    cpf: `999000${id}`,
    birth_date: '1980-01-01',
    phone: `1199990${id}`,
    personal_email: `staff${id}.personal@test.local`,
    job_title: 'Fixture Role',
    hiring_date: '2020-01-01',
    status: 'active',
  };
}

function guardianRow({ id, user_id }) {
  return {
    id,
    user_id,
    name: 'Guardian',
    last_name: `Fixture${id}`,
    cpf: `888000${id}`,
    phone: `1188880${id}`,
    email: `guardian${id}@test.local`,
    status: 'active',
  };
}

function studentRow({ id, user_id }) {
  return {
    id,
    user_id,
    name: 'Student',
    last_name: `Fixture${id}`,
    email: `student${id}@test.local`,
    registration_number: `REG${id}`,
    cpf: `777000${id}`,
    birth_date: '2010-01-01',
    status: 'active',
  };
}

function userRows() {
  const leveled = Object.entries(TEST_USERS).map(([level, u]) => ({
    ...u,
    access_level_id: Number(level),
  }));

  return [...leveled, SECOND_DIRECTOR, DISPOSABLE_USER, DISPOSABLE_PEER].map(
    (u) => ({
      id: u.id,
      email: u.email,
      access_level_id: u.access_level_id,
      is_temporary: false,
      status: 'active',
    }),
  );
}

// staff/guardians/students têm FK para users: os filhos saem antes da conta.
async function destroyFixtures() {
  await Staff.destroy({ where: { id: staffIds } });
  await Guardian.destroy({ where: { id: guardianIds } });
  await Student.destroy({ where: { id: studentIds } });
  await User.destroy({ where: { id: userIds } });
}

export async function setupTestData() {
  // Níveis 1-8 vêm do seed default-access-levels; só o nível demo (99) é criado
  // aqui, pois o demo-seed depende de env vars e não roda no bootstrap de teste.
  await AccessLevel.findOrCreate({
    where: { id: DEMO_LEVEL_ID },
    defaults: {
      id: DEMO_LEVEL_ID,
      name: 'Demo',
      description: 'Public read-only demo access.',
      hierarchy_weight: 1,
      is_system_level: 0,
      manage_account: 0,
      manage_record: 0,
      manage_academic: 0,
      manage_finance: 0,
    },
  });

  // Idempotência entre runs: limpa resíduo antes de recriar.
  await destroyFixtures();

  await User.bulkCreate(userRows());
  await Staff.bulkCreate(
    [DIRECTOR_STAFF, ORDINARY_STAFF, ORPHAN_STAFF].map(staffRow),
  );
  await Guardian.bulkCreate(
    [DIRECTOR_GUARDIAN, ORDINARY_GUARDIAN].map(guardianRow),
  );
  await Student.bulkCreate([DIRECTOR_STUDENT].map(studentRow));
}

// Os testes de delete mutam status por natureza. Restaurar entre casos mantém
// o resultado independente da ordem de execução. O access_level_id também
// entra: se a guarda de rebaixamento regredir, o GD fixture viraria nível 3 e
// os casos seguintes passariam a testar outra coisa em silêncio.
export async function resetFixtureStatuses() {
  await Promise.all(
    userRows().map((u) =>
      User.update(
        { status: 'active', access_level_id: u.access_level_id },
        { where: { id: u.id } },
      ),
    ),
  );
  await Staff.update({ status: 'active' }, { where: { id: staffIds } });
  await Guardian.update({ status: 'active' }, { where: { id: guardianIds } });
  await Student.update({ status: 'active' }, { where: { id: studentIds } });
}

export async function statusOf(modelName, id) {
  const row = await connection.models[modelName].findByPk(id);
  return row?.status;
}

export async function accessLevelOf(userId) {
  const row = await User.findByPk(userId);
  return row?.access_level_id;
}

export async function teardownTestData() {
  await destroyFixtures();
  await AccessLevel.destroy({ where: { id: DEMO_LEVEL_ID } });
}
