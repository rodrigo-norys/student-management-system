/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  return queryInterface.bulkInsert('access_levels', [
    {
      id: 1,
      name: 'TI',
      description: 'Full access to all system modules, including infrastructure and logs.',
      manage_account: 1,
      manage_record: 1,
      manage_finance: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: 'Management',
      description: 'School administration. Can manage records and financial data.',
      manage_account: 0,
      manage_record: 1,
      manage_finance: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: 'Staff',
      description: 'Academic staff. Can manage student records and grades.',
      manage_account: 0,
      manage_record: 1,
      manage_finance: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  return queryInterface.bulkDelete('access_levels', null, {});
}
