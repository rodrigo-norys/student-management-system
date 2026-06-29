/** @type {import('sequelize-cli').Migration} */

// Migration B — students.user_id: troca ON DELETE CASCADE por SET NULL (deletar
// a conta preserva o registro do aluno, alinhado a staff/guardians) e converte
// o índice não-único em UNIQUE para o banco garantir o 1:1. Um único ALTER por
// sentido (DDL não roda em transação no MariaDB). No down, ao recriar a FK sem
// índice prévio, o MariaDB recria o índice de suporte homônimo (estado baseline).

export async function up(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE `students` '
      + 'DROP FOREIGN KEY `students_user_id_foreign_idx`, '
      + 'DROP INDEX `students_user_id_foreign_idx`, '
      + 'ADD UNIQUE INDEX `students_user_id_unique` (`user_id`), '
      + 'ADD CONSTRAINT `students_user_id_fk` FOREIGN KEY (`user_id`) '
      + 'REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE',
  );
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE `students` '
      + 'DROP FOREIGN KEY `students_user_id_fk`, '
      + 'DROP INDEX `students_user_id_unique`, '
      + 'ADD CONSTRAINT `students_user_id_foreign_idx` FOREIGN KEY (`user_id`) '
      + 'REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  );
}
