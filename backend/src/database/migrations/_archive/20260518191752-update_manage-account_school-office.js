export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkUpdate(
    'access_levels',
    {
      manage_account: 1,
      updated_at: new Date(),
    },
    { id: 2 },
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkUpdate(
    'access_levels',
    {
      manage_account: 0,
      updated_at: new Date(),
    },
    { id: 2 },
  );
}
