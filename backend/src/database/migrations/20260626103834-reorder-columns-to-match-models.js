/** @type {import('sequelize-cli').Migration} */

// Migration I — reordena fisicamente as colunas de `users`, `addresses` e
// `student_classes` para casar com a ordem declarada nos models (FKs logo após
// o id; status antes dos timestamps). Apenas posição: tipo, nullability e
// default são idênticos ao estado atual (extraídos do SHOW CREATE). Um ALTER
// por tabela. Cosmético; MODIFY ... AFTER reconstrói a tabela (ALGORITHM=COPY).

export async function up(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE `users` '
      + 'MODIFY COLUMN `access_level_id` int(11) DEFAULT NULL AFTER `id`, '
      + 'MODIFY COLUMN `avatar_url` varchar(255) DEFAULT NULL AFTER `access_level_id`',
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE `addresses` '
      + 'MODIFY COLUMN `student_id` int(11) DEFAULT NULL AFTER `state`, '
      + 'MODIFY COLUMN `guardian_id` int(11) DEFAULT NULL AFTER `student_id`, '
      + 'MODIFY COLUMN `staff_id` int(11) DEFAULT NULL AFTER `guardian_id`, '
      + 'MODIFY COLUMN `unit_id` int(11) DEFAULT NULL AFTER `staff_id`',
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE `student_classes` '
      + "MODIFY COLUMN `status` enum('active','inactive') NOT NULL DEFAULT 'active' AFTER `enrollment_status`",
  );
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE `users` '
      + 'MODIFY COLUMN `email` varchar(150) NOT NULL AFTER `id`, '
      + 'MODIFY COLUMN `access_level_id` int(11) DEFAULT NULL AFTER `updated_at`',
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE `addresses` '
      + 'MODIFY COLUMN `student_id` int(11) DEFAULT NULL AFTER `id`, '
      + 'MODIFY COLUMN `guardian_id` int(11) DEFAULT NULL AFTER `student_id`, '
      + 'MODIFY COLUMN `staff_id` int(11) DEFAULT NULL AFTER `guardian_id`, '
      + 'MODIFY COLUMN `unit_id` int(11) DEFAULT NULL AFTER `staff_id`',
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE `student_classes` '
      + "MODIFY COLUMN `status` enum('active','inactive') NOT NULL DEFAULT 'active' AFTER `created_at`",
  );
}
