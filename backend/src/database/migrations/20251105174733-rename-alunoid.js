/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.renameColumn('photos', 'aluno_id', 'student_id');
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.renameColumn('photos', 'student_id', 'aluno_id');
}
