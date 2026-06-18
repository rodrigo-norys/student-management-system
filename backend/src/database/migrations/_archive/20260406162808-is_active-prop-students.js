/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('students', 'is_active', {
    type: Sequelize.ENUM('active', 'inactive', 'transferred', 'graduated', 'suspended'),
    defaultValue: 'active',
    after: 'user_id'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('students', 'is_active');
}
