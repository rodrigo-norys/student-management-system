/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('users', 'id', {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  });

  await queryInterface.changeColumn('users', 'access_level_id', {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'access_levels',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });

  await queryInterface.changeColumn('users', 'is_active', {
    type: Sequelize.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  });

  await queryInterface.changeColumn('users', 'is_temporary', {
    type: Sequelize.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('users', 'is_temporary', {
    type: Sequelize.TINYINT(4),
    allowNull: false,
    defaultValue: 1
  });

  await queryInterface.changeColumn('users', 'is_active', {
    type: Sequelize.TINYINT(4),
    allowNull: false,
    defaultValue: 1
  });

  await queryInterface.changeColumn('users', 'access_level_id', {
    type: Sequelize.INTEGER,
    allowNull: true
  });

  await queryInterface.changeColumn('users', 'id', {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  });
}
