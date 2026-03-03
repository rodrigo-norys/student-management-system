/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('students', 'avatar_url', {
    type: Sequelize.STRING(150),
    allowNull: true,
  });

  await queryInterface.changeColumn('students', 'medical_notes', {
    type: Sequelize.STRING(255),
    allowNull: true,
  });

  await queryInterface.changeColumn('students', 'registration_number', {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('students', 'avatar_url', {
    type: Sequelize.STRING(255),
  });

  await queryInterface.changeColumn('students', 'medical_notes', {
    type: Sequelize.TEXT,
  });
}
