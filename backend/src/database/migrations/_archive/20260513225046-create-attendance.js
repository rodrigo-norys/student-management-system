export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('attendances', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'students', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    class_allocation_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'class_allocations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('present', 'absent', 'justified'),
      allowNull: false,
      defaultValue: 'present',
    },
    notes: {
      type: Sequelize.STRING(255),
      allowNull: true,
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

  await queryInterface.addIndex(
    'attendances',
    ['student_id', 'class_allocation_id', 'date'],
    {
      unique: true,
      name: 'attendances_index_0',
    },
  );

  await queryInterface.addIndex('attendances', ['date'], {
    name: 'attendances_index_1',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('attendances');
}
