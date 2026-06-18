export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('access_levels', 'hierarchy_weight', {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    after: 'description',
  });

  await queryInterface.addColumn('access_levels', 'is_system_level', {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    after: 'hierarchy_weight',
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('access_levels', 'is_system_level');
  await queryInterface.removeColumn('access_levels', 'hierarchy_weight');
}
