/** @type {import('sequelize-cli').Migration} */

// Migration A — adiciona as FKs físicas de guardian_id, staff_id e unit_id em
// `addresses` (as colunas já existiam sem constraint). Um único ALTER por
// sentido: DDL não roda em transação no MariaDB, então agrupar as operações
// numa só instrução reduz o risco de estado parcial.

export async function up(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE `addresses` '
      + 'ADD INDEX `addresses_guardian_id_idx` (`guardian_id`), '
      + 'ADD INDEX `addresses_staff_id_idx` (`staff_id`), '
      + 'ADD CONSTRAINT `addresses_guardian_id_fk` FOREIGN KEY (`guardian_id`) '
      + 'REFERENCES `guardians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, '
      + 'ADD CONSTRAINT `addresses_staff_id_fk` FOREIGN KEY (`staff_id`) '
      + 'REFERENCES `staff` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, '
      + 'ADD CONSTRAINT `addresses_unit_id_fk` FOREIGN KEY (`unit_id`) '
      + 'REFERENCES `units` (`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  );
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    'ALTER TABLE `addresses` '
      + 'DROP FOREIGN KEY `addresses_guardian_id_fk`, '
      + 'DROP FOREIGN KEY `addresses_staff_id_fk`, '
      + 'DROP FOREIGN KEY `addresses_unit_id_fk`, '
      + 'DROP INDEX `addresses_guardian_id_idx`, '
      + 'DROP INDEX `addresses_staff_id_idx`',
  );
}
