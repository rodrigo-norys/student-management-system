/** @type {import('sequelize-cli').Migration} */

// Migration H — remove o índice redundante student_guardians_index_1 (student_id).
// A PK composta (student_id, guardian_id) já cobre student_id como prefixo à
// esquerda, então esse índice duplica a PK e também é dispensável como suporte da
// FK student_guardians_ibfk_1. O índice student_guardians_index_0 (guardian_id)
// NÃO é redundante (guardian_id não é prefixo da PK) e permanece.

export async function up(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE `student_guardians` DROP INDEX `student_guardians_index_1`',
  );
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE `student_guardians` ADD INDEX `student_guardians_index_1` (`student_id`)',
  );
}
