export async function up(queryInterface) {
  await queryInterface.bulkUpdate(
    'access_levels',
    { manage_account: 1 },
    { id: 2 },
  );

  await queryInterface.bulkUpdate(
    'access_levels',
    {
      name: 'Student',
      hierarchy_weight: 10,
      description:
        'View-only access to academic performance, attendance, and financial status.',
    },
    { id: 7 },
  );

  await queryInterface.bulkUpdate(
    'access_levels',
    {
      name: 'Security / Front Desk',
      hierarchy_weight: 20,
      description:
        'Access control and verification of authorized guardians for student dismissal.',
    },
    { id: 6 },
  );
}

export async function down(queryInterface) {
  await queryInterface.bulkUpdate(
    'access_levels',
    {
      name: 'Student / Guardian',
      hierarchy_weight: 10,
      description:
        'View-only access to academic performance, attendance, and financial status.',
    },
    { id: 6 },
  );

  await queryInterface.bulkUpdate(
    'access_levels',
    {
      name: 'Security / Front Desk',
      hierarchy_weight: 20,
      description:
        'Access control and verification of authorized guardians for student dismissal.',
    },
    { id: 7 },
  );

  await queryInterface.bulkUpdate(
    'access_levels',
    { manage_account: 0 },
    { id: 2 },
  );
}
