export async function up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.bulkUpdate(
      'access_levels',
      {
        name: 'Student',
        description: 'View-only access to academic performance, attendance, and financial status.',
        hierarchy_weight: 10,
        updated_at: new Date()
      },
      { id: 7 },
      { transaction }
    );

    await queryInterface.bulkUpdate(
      'access_levels',
      {
        name: 'Security / Front Desk',
        description: 'Access control and verification of authorized guardians for student dismissal.',
        hierarchy_weight: 20,
        updated_at: new Date()
      },
      { id: 6 },
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function down(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.bulkUpdate(
      'access_levels',
      {
        name: 'Security // Front Desk',
        description: 'View-only access to academic performance, attendance, and financial status.',
        hierarchy_weight: 10,
        updated_at: new Date()
      },
      { id: 6 },
      { transaction }
    );

    await queryInterface.bulkUpdate(
      'access_levels',
      {
        name: 'Security / Front Desk',
        description: 'Access control and verification of authorized guardians for student dismissal.',
        hierarchy_weight: 20,
        updated_at: new Date()
      },
      { id: 7 },
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
