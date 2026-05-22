export async function up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    // Atualiza apenas a coluna 'name' do ID 6
    await queryInterface.bulkUpdate(
      'access_levels',
      {
        name: 'Security // Front Desk',
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
    // Reverte a alteração para o nome original
    await queryInterface.bulkUpdate(
      'access_levels',
      {
        name: 'Student / Guardian',
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
