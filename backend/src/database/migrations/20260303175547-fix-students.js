/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('students', 'email');
  await queryInterface.removeColumn('students', 'address_id');

  await queryInterface.changeColumn('students', 'user_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    after: 'id'
  });

  await queryInterface.changeColumn('students', 'avatar_url', {
    type: Sequelize.STRING(150),
    allowNull: true,
    after: 'user_id'
  });

  await queryInterface.changeColumn('students', 'name', {
    type: Sequelize.STRING(50),
    allowNull: false,
    after: 'avatar_url'
  });

  await queryInterface.changeColumn('students', 'last_name', {
    type: Sequelize.STRING(100),
    allowNull: false,
    after: 'name'
  });

  await queryInterface.changeColumn('students', 'registration_number', {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true,
    after: 'last_name'
  });

  await queryInterface.changeColumn('students', 'birth_date', {
    type: Sequelize.DATEONLY,
    allowNull: false,
    after: 'registration_number'
  });

  await queryInterface.changeColumn('students', 'cpf', {
    type: Sequelize.STRING(14),
    allowNull: false,
    unique: true,
    after: 'birth_date'
  });

  await queryInterface.changeColumn('students', 'blood_type', {
    type: Sequelize.STRING(3),
    allowNull: true,
    after: 'cpf'
  });

  await queryInterface.changeColumn('students', 'medical_notes', {
    type: Sequelize.STRING(255),
    allowNull: true,
    after: 'blood_type'
  });

  await queryInterface.changeColumn('students', 'created_at', {
    type: Sequelize.DATE,
    allowNull: false,
    after: 'medical_notes'
  });

  await queryInterface.changeColumn('students', 'updated_at', {
    type: Sequelize.DATE,
    allowNull: false,
    after: 'created_at'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('students', 'name', {
    type: Sequelize.STRING(255),
    allowNull: false,
    after: 'id'
  });

  await queryInterface.changeColumn('students', 'last_name', {
    type: Sequelize.STRING(255),
    allowNull: false,
    after: 'name'
  });

  await queryInterface.addColumn('students', 'email', {
    type: Sequelize.STRING(255),
    allowNull: false,
    after: 'last_name'
  });

  await queryInterface.changeColumn('students', 'created_at', {
    type: Sequelize.DATE,
    allowNull: false,
    after: 'email'
  });

  await queryInterface.changeColumn('students', 'updated_at', {
    type: Sequelize.DATE,
    allowNull: false,
    after: 'created_at'
  });

  await queryInterface.changeColumn('students', 'user_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    after: 'updated_at'
  });

  await queryInterface.addColumn('students', 'address_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    after: 'user_id'
  });

  await queryInterface.changeColumn('students', 'registration_number', {
    type: Sequelize.STRING(20),
    allowNull: false,
    after: 'address_id'
  });

  await queryInterface.changeColumn('students', 'cpf', {
    type: Sequelize.STRING(255),
    allowNull: false,
    after: 'registration_number'
  });

  await queryInterface.changeColumn('students', 'birth_date', {
    type: Sequelize.DATE,
    allowNull: false,
    after: 'cpf'
  });

  await queryInterface.changeColumn('students', 'avatar_url', {
    type: Sequelize.STRING(150),
    allowNull: true,
    after: 'birth_date'
  });

  await queryInterface.changeColumn('students', 'blood_type', {
    type: Sequelize.STRING(255),
    allowNull: true,
    after: 'avatar_url'
  });

  await queryInterface.changeColumn('students', 'medical_notes', {
    type: Sequelize.STRING(255),
    allowNull: true,
    after: 'blood_type'
  });
}
