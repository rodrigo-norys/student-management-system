export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('student_guardians', 'relationship_type', {
    type: Sequelize.STRING(30),
    allowNull: false,
  });

  await queryInterface.addColumn('student_guardians', 'is_emergency_contact', {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    after: 'is_financial_resp',
  });

  await queryInterface.addColumn('student_guardians', 'is_active', {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 1,
    after: 'is_emergency_contact',
  });

  await queryInterface.addIndex('student_guardians', ['guardian_id'], {
    name: 'student_guardians_index_0',
  });

  await queryInterface.addIndex('student_guardians', ['student_id'], {
    name: 'student_guardians_index_1',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex(
    'student_guardians',
    'student_guardians_index_0',
  );
  await queryInterface.removeIndex(
    'student_guardians',
    'student_guardians_index_1',
  );

  await queryInterface.removeColumn('student_guardians', 'is_active');
  await queryInterface.removeColumn(
    'student_guardians',
    'is_emergency_contact',
  );

  await queryInterface.changeColumn('student_guardians', 'relationship_type', {
    type: Sequelize.STRING(20),
    allowNull: false,
  });
}
