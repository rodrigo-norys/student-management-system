const SIMPLE_TABLES = [
  'units',
  'unit_classes',
  'subjects',
  'student_classes',
  'student_guardians',
  'staff_units',
  'class_allocations',
  'student_grades',
];

const STUDENT_USER_VALUES = [
  'active',
  'inactive',
  'transferred',
  'graduated',
  'suspended',
];

const STAFF_VALUES = ['active', 'inactive', 'suspended', 'on_leave'];

export async function up(queryInterface, Sequelize) {
  const sql = queryInterface.sequelize;

  // Demais tabelas: boolean -> ENUM('active','inactive').
  for (const table of SIMPLE_TABLES) {
    await queryInterface.addColumn(table, 'status', {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    });
    await sql.query(
      `UPDATE \`${table}\` SET status = IF(is_active = 1, 'active', 'inactive')`,
    );
    await queryInterface.removeColumn(table, 'is_active');
  }

  // USERS
  await queryInterface.addColumn('users', 'status', {
    type: Sequelize.ENUM(...STUDENT_USER_VALUES),
    allowNull: false,
    defaultValue: 'active',
  });
  await sql.query(
    `UPDATE \`users\` SET status = IF(is_active = 1, 'active', 'inactive')`,
  );
  await queryInterface.removeColumn('users', 'is_active');

  // STAFF
  await queryInterface.changeColumn('staff', 'status', {
    type: Sequelize.ENUM(...STAFF_VALUES),
    allowNull: false,
    defaultValue: 'active',
  });
  await queryInterface.removeColumn('staff', 'is_active');

  // STUDENTS
  await queryInterface.addColumn('students', 'status', {
    type: Sequelize.ENUM(...STUDENT_USER_VALUES),
    allowNull: false,
    defaultValue: 'active',
  });
  await sql.query(`UPDATE \`students\` SET status = is_active`);
  await queryInterface.removeColumn('students', 'is_active');

  // GUARDIANS
  await queryInterface.addColumn('guardians', 'status', {
    type: Sequelize.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  });

  // ATTENDANCES
  await queryInterface.renameColumn(
    'attendances',
    'status',
    'attendance_status',
  );
  await queryInterface.addColumn('attendances', 'status', {
    type: Sequelize.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  });
  await sql.query(
    `UPDATE \`attendances\` SET status = IF(is_active = 1, 'active', 'inactive')`,
  );
  await queryInterface.removeColumn('attendances', 'is_active');
}

export async function down(queryInterface, Sequelize) {
  const sql = queryInterface.sequelize;

  for (const table of SIMPLE_TABLES) {
    await queryInterface.addColumn(table, 'is_active', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 1,
    });
    await sql.query(
      `UPDATE \`${table}\` SET is_active = IF(status = 'active', 1, 0)`,
    );
    await queryInterface.removeColumn(table, 'status');
  }

  await queryInterface.addColumn('users', 'is_active', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
  await sql.query(
    `UPDATE \`users\` SET is_active = IF(status = 'active', 1, 0)`,
  );
  await queryInterface.removeColumn('users', 'status');

  await queryInterface.addColumn('staff', 'is_active', {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1,
  });
  await sql.query(
    `UPDATE \`staff\` SET is_active = IF(status = 'active', 1, 0)`,
  );
  await queryInterface.changeColumn('staff', 'status', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'active',
  });

  await queryInterface.addColumn('students', 'is_active', {
    type: Sequelize.ENUM(...STUDENT_USER_VALUES),
    allowNull: false,
    defaultValue: 'active',
  });
  await sql.query(`UPDATE \`students\` SET is_active = status`);
  await queryInterface.removeColumn('students', 'status');

  await queryInterface.removeColumn('guardians', 'status');

  // attendances: reverte status -> is_active e attendance_status -> status.
  await queryInterface.addColumn('attendances', 'is_active', {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1,
  });
  await sql.query(
    `UPDATE \`attendances\` SET is_active = IF(status = 'active', 1, 0)`,
  );
  await queryInterface.removeColumn('attendances', 'status');
  await queryInterface.renameColumn(
    'attendances',
    'attendance_status',
    'status',
  );
}
