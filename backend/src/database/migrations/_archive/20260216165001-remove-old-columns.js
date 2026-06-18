/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {

  await queryInterface.removeColumn('students', 'weight');
  await queryInterface.removeColumn('students', 'height');
  await queryInterface.removeColumn('students', 'age');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('students', 'weight', {
    type: Sequelize.FLOAT,
    allowNull: true,
  });
  await queryInterface.addColumn('students', 'height', {
    type: Sequelize.FLOAT,
    allowNull: true,
  });
  await queryInterface.addColumn('students', 'age', {
    type: Sequelize.INTEGER,
    allowNull: true,
  });
}
