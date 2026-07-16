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
  6: { id: 9006, email: 'lvl6@test.local' },
  7: { id: 9007, email: 'lvl7@test.local' },
  8: { id: 9008, email: 'lvl8@test.local' },
  [DEMO_LEVEL_ID]: { id: 9099, email: 'lvl99@test.local' },
};

// Alvo da guarda de nível-1. O 9001 é o ator dos testes; usá-lo como alvo
// dispararia o self-guard antes.
export const SECOND_DIRECTOR = {
  id: 9011,
  email: 'lvl1-b@test.local',
  access_level_id: 1,
};

// Alvos descartáveis do caminho feliz: absorvem o soft delete e mantêm os
// TEST_USERS intactos para as outras suítes.
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

// Fichas de um General Director. Apontam para o segundo diretor: ligadas ao
// 9001, ator dos testes, o self-guard dispararia antes da guarda de nível.
export const DIRECTOR_STAFF = { id: 9101, user_id: SECOND_DIRECTOR.id };
export const DIRECTOR_GUARDIAN = { id: 9201, user_id: SECOND_DIRECTOR.id };
export const DIRECTOR_STUDENT = { id: 9301, user_id: SECOND_DIRECTOR.id };

// Fichas de contas comuns: delimitam a guarda ao nível 1.
export const ORDINARY_STAFF = { id: 9102, user_id: TEST_USERS[5].id };
export const ORDINARY_GUARDIAN = { id: 9202, user_id: TEST_USERS[4].id };
export const ORDINARY_STUDENT = { id: 9302, user_id: TEST_USERS[3].id };

// Registro sem conta vinculada: cobre o ramo "alvo sem hierarquia" da guarda.
export const ORPHAN_STAFF = { id: 9103, user_id: null };

// Staff sem manage_account, para o self-service de avatar.
export const FINANCE_STAFF = { id: 9105, user_id: TEST_USERS[3].id };

// Nível 6 tem as quatro manage_* zeradas, idêntico a Student(7)/Guardian(8);
// só esta linha em `staff` o distingue deles.
export const SECURITY_STAFF = { id: 9106, user_id: TEST_USERS[6].id };

// Ficha desligada com conta ativa. user_id é unique em staff, daí o nível 4,
// que não tem outra ficha.
export const INACTIVE_STAFF = {
  id: 9107,
  user_id: TEST_USERS[4].id,
  status: 'inactive',
};

// Fichas próprias de um Student e de um Guardian.
export const SELF_STUDENT = { id: 9304, user_id: TEST_USERS[7].id };
export const SELF_GUARDIAN = { id: 9204, user_id: TEST_USERS[8].id };

// Conta ligada aos três tipos de ficha ao mesmo tempo, alvo do cascade. Peso 30
// para o ator nível 2 ter autoridade sobre ela.
export const CASCADE_USER = {
  id: 9013,
  email: 'cascade-target@test.local',
  access_level_id: 5,
};
export const CASCADE_STAFF = { id: 9104, user_id: CASCADE_USER.id };
export const CASCADE_GUARDIAN = { id: 9203, user_id: CASCADE_USER.id };
export const CASCADE_STUDENT = { id: 9303, user_id: CASCADE_USER.id };

const userIds = [
  ...Object.values(TEST_USERS).map((u) => u.id),
  SECOND_DIRECTOR.id,
  DISPOSABLE_USER.id,
  DISPOSABLE_PEER.id,
  CASCADE_USER.id,
];
// Lista única das fichas de staff: o setup cria a partir dela e o reset restaura
// cada uma ao seu próprio status.
const STAFF_FIXTURES = [
  DIRECTOR_STAFF,
  ORDINARY_STAFF,
  ORPHAN_STAFF,
  CASCADE_STAFF,
  FINANCE_STAFF,
  SECURITY_STAFF,
  INACTIVE_STAFF,
];
const staffIds = STAFF_FIXTURES.map((s) => s.id);
const guardianIds = [
  DIRECTOR_GUARDIAN.id,
  ORDINARY_GUARDIAN.id,
  CASCADE_GUARDIAN.id,
  SELF_GUARDIAN.id,
];
const studentIds = [
  DIRECTOR_STUDENT.id,
  ORDINARY_STUDENT.id,
  CASCADE_STUDENT.id,
  SELF_STUDENT.id,
];

export function testUser(levelId) {
  return TEST_USERS[levelId];
}

function staffRow({ id, user_id, status = 'active' }) {
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
    status,
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

  return [
    ...leveled,
    SECOND_DIRECTOR,
    DISPOSABLE_USER,
    DISPOSABLE_PEER,
    CASCADE_USER,
  ].map((u) => ({
    id: u.id,
    email: u.email,
    access_level_id: u.access_level_id,
    is_temporary: false,
    status: 'active',
  }));
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
  await Staff.bulkCreate(STAFF_FIXTURES.map(staffRow));
  await Guardian.bulkCreate(
    [DIRECTOR_GUARDIAN, ORDINARY_GUARDIAN, CASCADE_GUARDIAN, SELF_GUARDIAN].map(
      guardianRow,
    ),
  );
  await Student.bulkCreate(
    [DIRECTOR_STUDENT, ORDINARY_STUDENT, CASCADE_STUDENT, SELF_STUDENT].map(
      studentRow,
    ),
  );
}

// Os testes de delete mutam status por natureza; restaurar entre casos mantém o
// resultado independente da ordem. O access_level_id entra junto: um GD fixture
// rebaixado faria os casos seguintes testarem outra coisa.
export async function resetFixtureStatuses() {
  await Promise.all(
    userRows().map((u) =>
      User.update(
        { status: 'active', access_level_id: u.access_level_id },
        { where: { id: u.id } },
      ),
    ),
  );
  // Cada ficha volta ao seu próprio status: a INACTIVE_STAFF nasce inativa e um
  // reset cego a reativaria.
  await Promise.all(
    STAFF_FIXTURES.map((s) =>
      Staff.update({ status: s.status ?? 'active' }, { where: { id: s.id } }),
    ),
  );
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

export async function setStatus(modelName, id, status) {
  await connection.models[modelName].update({ status }, { where: { id } });
}

export async function userIdOf(modelName, id) {
  const row = await connection.models[modelName].findByPk(id);
  return row?.user_id;
}

export async function teardownTestData() {
  await destroyFixtures();
  await AccessLevel.destroy({ where: { id: DEMO_LEVEL_ID } });
}
