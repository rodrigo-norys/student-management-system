/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  return queryInterface.removeColumn('users', 'name');
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.addColumn('users', 'name', {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  });
}
