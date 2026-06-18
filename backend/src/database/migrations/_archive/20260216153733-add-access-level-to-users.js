/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'access_level_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'access_levels',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'access_level_id');
}
