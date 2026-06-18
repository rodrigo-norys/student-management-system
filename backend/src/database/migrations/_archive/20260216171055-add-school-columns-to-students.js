/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('students', 'registration_number', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });

  await queryInterface.addColumn('students', 'cpf', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });

  await queryInterface.addColumn('students', 'birth_date', {
    type: Sequelize.DATEONLY,
    allowNull: false,
  });

  await queryInterface.addColumn('students', 'avatar_url', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('students', 'blood_type', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('students', 'medical_notes', {
    type: Sequelize.TEXT,
    allowNull: true,
  });

  // Índices
  await queryInterface.addIndex('students', ['registration_number'], {
    name: 'students_registration_number_unique',
    unique: true,
  });

  await queryInterface.addIndex('students', ['name', 'last_name'], {
    name: 'students_name_lastname_index',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex('students', 'students_registration_number_unique');
  await queryInterface.removeIndex('students', 'students_name_lastname_index');

  await queryInterface.removeColumn('students', 'registration_number');
  await queryInterface.removeColumn('students', 'cpf');
  await queryInterface.removeColumn('students', 'birth_date');
  await queryInterface.removeColumn('students', 'avatar_url');
  await queryInterface.removeColumn('students', 'blood_type');
  await queryInterface.removeColumn('students', 'medical_notes');
}
