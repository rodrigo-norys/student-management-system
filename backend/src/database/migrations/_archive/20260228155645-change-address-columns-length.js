/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('addresses', 'zip_code', {
    type: Sequelize.STRING(9),
    allowNull: false,
  });

  await queryInterface.changeColumn('addresses', 'street', {
    type: Sequelize.STRING(100),
    allowNull: false,
  });

  await queryInterface.changeColumn('addresses', 'number', {
    type: Sequelize.STRING(10),
    allowNull: false,
  });

  await queryInterface.changeColumn('addresses', 'complement', {
    type: Sequelize.STRING(100),
    allowNull: true,
  });

  await queryInterface.changeColumn('addresses', 'neighborhood', {
    type: Sequelize.STRING(100),
    allowNull: false,
  });

  await queryInterface.changeColumn('addresses', 'city', {
    type: Sequelize.STRING(100),
    allowNull: false,
  });

  await queryInterface.changeColumn('addresses', 'state', {
    type: Sequelize.CHAR(2),
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('addresses', 'street', {
    type: Sequelize.STRING,
  });
}
