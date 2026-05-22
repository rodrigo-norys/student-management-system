export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    'access_levels',
    [
      {
        id: 8,
        name: 'Guardian',
        description: 'View-only access to academic performance, attendance, and financial status.',
        hierarchy_weight: 10,
        is_system_level: 1,
        manage_account: 0,
        manage_record: 0,
        manage_academic: 0,
        manage_finance: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {}
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete(
    'access_levels',
    { id: 8 },
    {}
  );
}
