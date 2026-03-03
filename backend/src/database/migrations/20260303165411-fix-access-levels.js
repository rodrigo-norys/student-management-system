/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('access_levels', 'id', {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  });

  await queryInterface.changeColumn('access_levels', 'manage_academic', {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('access_levels', 'manage_academic', {
    type: Sequelize.INTEGER
  });
}
