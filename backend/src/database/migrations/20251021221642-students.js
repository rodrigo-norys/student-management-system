/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return await queryInterface.createTable('students', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    age: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    weight: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    height: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  return await queryInterface.dropTable('users');
}
