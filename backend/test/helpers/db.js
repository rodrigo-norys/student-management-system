import connection from '../../src/database/index.js';

const { User, AccessLevel } = connection.models;

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

const testUserIds = Object.values(TEST_USERS).map((u) => u.id);

export function testUser(levelId) {
  return TEST_USERS[levelId];
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
  await User.destroy({ where: { id: testUserIds } });

  await User.bulkCreate(
    Object.entries(TEST_USERS).map(([level, u]) => ({
      id: u.id,
      email: u.email,
      access_level_id: Number(level),
      is_temporary: false,
      status: 'active',
    })),
  );
}

export async function teardownTestData() {
  await User.destroy({ where: { id: testUserIds } });
  await AccessLevel.destroy({ where: { id: DEMO_LEVEL_ID } });
}
