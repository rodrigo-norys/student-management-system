/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('access_levels', 'manage_academic', {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    after: 'manage_record',
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('access_levels', 'manage_academic');
}
  