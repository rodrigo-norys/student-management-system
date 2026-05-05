/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('guardians', 'phone', {
    type: Sequelize.STRING(15),
    allowNull: false,
    defaultValue: '',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('guardians', 'phone', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}
