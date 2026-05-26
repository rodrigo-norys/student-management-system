export async function up(queryInterface, Sequelize) {
  
  const simpleStatus = {
    type: Sequelize.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  };

  const fullStatus = {
    type: Sequelize.ENUM(
      'active',
      'inactive',
      'transferred',
      'graduated',
      'suspended',
    ),
    allowNull: false,
    defaultValue: 'active',
  };

  await queryInterface.changeColumn('attendances', 'status', {
    ...simpleStatus,
    after: 'notes',
  });
  await queryInterface.changeColumn('class_allocations', 'status', {
    ...simpleStatus,
    after: 'subject_id',
  });
  await queryInterface.changeColumn('guardians', 'status', {
    ...simpleStatus,
    after: 'email',
  });
  await queryInterface.changeColumn('staff_units', 'status', {
    ...simpleStatus,
    after: 'unit_id',
  });
  await queryInterface.changeColumn('student_classes', 'status', {
    ...simpleStatus,
    after: 'created_at',
  });
  await queryInterface.changeColumn('student_guardians', 'status', {
    ...simpleStatus,
    after: 'is_emergency_contact',
  });
  await queryInterface.changeColumn('subjects', 'status', {
    ...simpleStatus,
    after: 'is_elective',
  });
  await queryInterface.changeColumn('unit_classes', 'status', {
    ...simpleStatus,
    after: 'max_students',
  });
  await queryInterface.changeColumn('units', 'status', {
    ...simpleStatus,
    after: 'phone',
  });

  await queryInterface.changeColumn('students', 'status', {
    ...fullStatus,
    after: 'medical_notes',
  });
  await queryInterface.changeColumn('users', 'status', {
    ...fullStatus,
    after: 'is_temporary',
  });

  // STAFF.
  await queryInterface.changeColumn('staff', 'termination_date', {
    type: Sequelize.DATEONLY,
    allowNull: true,
    after: 'hiring_date',
  });
  await queryInterface.changeColumn('staff', 'medical_notes', {
    type: Sequelize.STRING,
    allowNull: true,
    after: 'termination_date',
  });
  await queryInterface.changeColumn('staff', 'status', {
    type: Sequelize.ENUM('active', 'inactive', 'suspended', 'on_leave'),
    allowNull: false,
    defaultValue: 'active',
    after: 'medical_notes',
  });

  // STUDENT_CLASSES.
  await queryInterface.changeColumn('student_classes', 'enrollment_status', {
    type: Sequelize.ENUM(
      'active',
      'inactive',
      'transferred',
      'dropped_out',
      'graduated',
    ),
    allowNull: true,
    defaultValue: 'active',
    after: 'enrollment_date',
  });

  // STUDENT_GRADES.
  await queryInterface.changeColumn('student_grades', 'subject_status', {
    type: Sequelize.ENUM('studying', 'approved', 'failed', 'recovery'),
    allowNull: true,
    defaultValue: 'studying',
    after: 'absences',
  });
  await queryInterface.changeColumn('student_grades', 'status', {
    ...simpleStatus,
    after: 'subject_status',
  });
}

export async function down() {}
