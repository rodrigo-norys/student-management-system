/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'avatar_url', {
    type: Sequelize.STRING,
    allowNull: true,
    after: 'email',
  });

  await queryInterface.addColumn('users', 'is_active', {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1,
    after: 'password_hash',
  });

  await queryInterface.addColumn('users', 'is_temporary', {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1,
    after: 'is_active',
  });


  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });

  await queryInterface.changeColumn('users', 'access_level_id', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'access_levels',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'avatar_url');
  await queryInterface.removeColumn('users', 'is_active');
  await queryInterface.removeColumn('users', 'is_temporary');

  await queryInterface.changeColumn('users', 'access_level_id', {
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
