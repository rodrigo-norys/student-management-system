export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('student_classes', {
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
    unit_class_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'unit_classes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    enrollment_status: {
      type: Sequelize.ENUM(
        'active',
        'inactive',
        'transferred',
        'dropped_out',
        'graduated',
      ),
      allowNull: false,
      defaultValue: 'active',
    },
    enrollment_date: {
      type: Sequelize.DATEONLY,
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

  await queryInterface.addIndex(
    'student_classes',
    ['student_id', 'unit_class_id'],
    {
      unique: true,
      name: 'student_classes_index_0',
    },
  );

  await queryInterface.addIndex('student_classes', ['unit_class_id'], {
    name: 'student_classes_index_1',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('student_classes');
}
