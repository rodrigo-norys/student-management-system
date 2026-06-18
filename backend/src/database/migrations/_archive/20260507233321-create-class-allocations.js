export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('class_allocations', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    staff_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'staff',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    },
    unit_class_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'unit_classes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    },
    subject_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'subjects',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
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

  // Garante que cada disciplina tenha apenas UM professor por turma
  await queryInterface.addIndex(
    'class_allocations',
    ['unit_class_id', 'subject_id'],
    {
      unique: true,
      name: 'class_allocations_index_0',
    },
  );

  await queryInterface.addIndex('class_allocations', ['staff_id'], {
    name: 'class_allocations_index_1',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('class_allocations');
}
