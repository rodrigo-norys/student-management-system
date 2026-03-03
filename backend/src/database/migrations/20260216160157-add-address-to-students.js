/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('students', 'address_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('students', 'address_id');
}
