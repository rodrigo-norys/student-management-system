/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  return await queryInterface.addColumn('students', 'user_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}

export async function down(queryInterface, Sequelize) {
  return await queryInterface.removeColumn('students', 'user_id');
};
