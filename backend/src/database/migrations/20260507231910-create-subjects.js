export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('subjects', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    knowledge_area: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    is_elective: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 1,
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

  await queryInterface.addIndex('subjects', ['name'], {
    unique: true,
    name: 'subjects_index_0',
  });

  await queryInterface.addIndex('subjects', ['code'], {
    unique: true,
    name: 'subjects_index_1',
  });

  await queryInterface.addIndex('subjects', ['knowledge_area'], {
    name: 'subjects_index_2',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('subjects');
}
