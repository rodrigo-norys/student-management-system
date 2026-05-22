export async function up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.sequelize.query(`
      UPDATE users
      SET avatar_url = CONCAT('students/', (SELECT avatar_url FROM students WHERE students.user_id = users.id))
      WHERE id IN (SELECT user_id FROM students WHERE avatar_url IS NOT NULL)
      AND avatar_url IS NULL;
    `, { transaction });

    await queryInterface.sequelize.query(`
      UPDATE users
      SET avatar_url = CONCAT('staff/', (SELECT avatar_url FROM staff WHERE staff.user_id = users.id))
      WHERE id IN (SELECT user_id FROM staff WHERE avatar_url IS NOT NULL)
      AND avatar_url IS NULL;
    `, { transaction });

    await queryInterface.sequelize.query(`
      UPDATE users
      SET avatar_url = CONCAT('guardians/', (SELECT avatar_url FROM guardians WHERE guardians.user_id = users.id))
      WHERE id IN (SELECT user_id FROM guardians WHERE avatar_url IS NOT NULL)
      AND avatar_url IS NULL;
    `, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function down(queryInterface, Sequelize) {}
