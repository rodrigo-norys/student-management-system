/** @type {import('sequelize-cli').Migration} */

// Migration C — remove a tabela `photos` (vazia, sem model ORM, sem referência
// no código de aplicação e redundante com students.avatar_url). Destrutiva: o
// down recria a tabela com o DDL idêntico ao baseline (incluindo a FK
// photos_ibfk_1 student_id -> students ON DELETE SET NULL).

export async function up(queryInterface) {
  await queryInterface.sequelize.query('DROP TABLE `photos`');
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    'CREATE TABLE `photos` (' +
      '`id` int(11) NOT NULL AUTO_INCREMENT, ' +
      '`originalname` varchar(255) NOT NULL, ' +
      '`filename` varchar(255) NOT NULL, ' +
      '`student_id` int(11) DEFAULT NULL, ' +
      '`created_at` datetime NOT NULL, ' +
      '`updated_at` datetime NOT NULL, ' +
      'PRIMARY KEY (`id`), ' +
      'KEY `student_id` (`student_id`), ' +
      'CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`student_id`) ' +
      'REFERENCES `students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE' +
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci',
  );
}
