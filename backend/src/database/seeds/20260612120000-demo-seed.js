import bcryptjs from 'bcryptjs';

const DEMO_LEVEL_ID = Number(process.env.DEMO_LEVEL_ID) || 99;

export async function up(queryInterface) {
  const now = new Date();

  const email = process.env.DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'DEMO_USER_EMAIL and DEMO_USER_PASSWORD must be set in the environment to seed the demo user.',
    );
  }

  // Nível read-only: todas as flags manage_* zeradas e peso mínimo. Como as
  // rotas de escrita exigem a flag via roleAuth, este nível já é selado contra
  // POST/PUT/DELETE pela própria API (o guard em loginRequired é o reforço).
  const [existingLevels] = await queryInterface.sequelize.query(
    `SELECT id FROM access_levels WHERE id = ${DEMO_LEVEL_ID} LIMIT 1`,
  );

  if (!existingLevels.length) {
    await queryInterface.bulkInsert('access_levels', [
      {
        id: DEMO_LEVEL_ID,
        name: 'Demo',
        description: 'Public read-only demo access. Blocked from any mutation.',
        hierarchy_weight: 1,
        is_system_level: 0,
        manage_account: 0,
        manage_record: 0,
        manage_academic: 0,
        manage_finance: 0,
        created_at: now,
        updated_at: now,
      },
    ]);
  }

  const [existingUsers] = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE email = ${queryInterface.sequelize.escape(email)} LIMIT 1`,
  );

  if (!existingUsers.length) {
    const password_hash = await bcryptjs.hash(password, 8);

    await queryInterface.bulkInsert('users', [
      {
        email,
        password_hash,
        access_level_id: DEMO_LEVEL_ID,
        is_temporary: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
    ]);
  }
}

export async function down(queryInterface) {
  const email = process.env.DEMO_USER_EMAIL;

  if (email) {
    await queryInterface.bulkDelete('users', { email });
  }

  await queryInterface.bulkDelete('access_levels', { id: DEMO_LEVEL_ID });
}
