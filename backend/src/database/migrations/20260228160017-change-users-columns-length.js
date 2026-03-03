/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING(150),
    allowNull: false,
    unique: true,
  });

  await queryInterface.changeColumn('users', 'password_hash', {
    type: Sequelize.STRING(100),
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING(100),
  });

  await queryInterface.changeColumn('users', 'password_hash', {
    type: Sequelize.STRING(255),
  });
}
