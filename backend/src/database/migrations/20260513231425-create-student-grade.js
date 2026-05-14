export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('student_grades', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    class_allocation_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'class_allocations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    student_classes_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'student_classes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    grade_1: {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    grade_2: {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    grade_3: {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    grade_4: {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    final_average: {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    subject_status: {
      type: Sequelize.ENUM('studying', 'approved', 'failed', 'recovery'),
      allowNull: false,
      defaultValue: 'studying',
    },
    absences: {
      type: Sequelize.INTEGER,
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

  await queryInterface.addIndex(
    'student_grades',
    ['student_classes_id', 'class_allocation_id'],
    {
      unique: true,
      name: 'student_grades_index_0',
    },
  );
}

export async function down(queryInterface) {
  await queryInterface.dropTable('student_grades');
}
