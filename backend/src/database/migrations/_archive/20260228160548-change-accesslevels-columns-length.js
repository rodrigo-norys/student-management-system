/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('access_levels', 'name', {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true,
  });

  await queryInterface.changeColumn('access_levels', 'description', {
    type: Sequelize.STRING(150),
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('access_levels', 'name', {
    type: Sequelize.STRING(45),
  });

  await queryInterface.changeColumn('access_levels', 'description', {
    type: Sequelize.STRING(255),
  });
}
