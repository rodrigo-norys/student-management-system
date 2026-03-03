/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.bulkDelete('access_levels', null, {});

  return queryInterface.bulkInsert('access_levels', [
    {
      id: 1,
      name: 'Full Access',
      description: 'Highest clearance level. Unrestricted access to system configuration, user identity management, academic records, and financial data.',
      manage_account: 1,
      manage_record: 1,
      manage_finance: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: 'Technical Admin',
      description: 'System maintenance and IT support clearance. Authorized to manage user accounts and oversee records. Financial operations are restricted.',
      manage_account: 1,
      manage_record: 1,
      manage_finance: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: 'Finance Admin',
      description: 'Financial oversight clearance. Authorized to manage billing, payments, and account status. No access to academic or pedagogical records.',
      manage_account: 1,
      manage_record: 0,
      manage_finance: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: 'Academic Admin',
      description: 'Pedagogical and academic management clearance. Authorized to manage student records and classroom data. No access to financial modules.',
      manage_account: 1,
      manage_record: 1,
      manage_finance: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 5,
      name: 'Basic Access',
      description: 'Standard read-only clearance for general consultation. No management or editing privileges for any system module.',
      manage_account: 0,
      manage_record: 0,
      manage_finance: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  return queryInterface.bulkDelete('access_levels', null, {});
}
