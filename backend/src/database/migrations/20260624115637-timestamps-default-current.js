/** @type {import('sequelize-cli').Migration} */

// Migration G — padroniza created_at/updated_at com DEFAULT current_timestamp()
// nas tabelas que não tinham default (um INSERT fora do ORM falhava por NOT NULL
// sem default). `access_levels` e `addresses` já tinham, ficam de fora. O ON
// UPDATE não é adicionado de propósito: o Sequelize já gerencia updated_at em
// todo save, e SET DEFAULT é metadado (instantâneo), sem rebuild da tabela.

const tables = [
  'units',
  'subjects',
  'users',
  'staff',
  'students',
  'guardians',
  'unit_classes',
  'staff_units',
  'student_guardians',
  'class_allocations',
  'student_classes',
  'student_grades',
  'attendances',
];

export async function up(queryInterface) {
  for (const table of tables) {
    await queryInterface.sequelize.query(
      `ALTER TABLE \`${table}\` ` +
        'ALTER COLUMN `created_at` SET DEFAULT current_timestamp(), ' +
        'ALTER COLUMN `updated_at` SET DEFAULT current_timestamp()',
    );
  }
}

export async function down(queryInterface) {
  for (const table of tables) {
    await queryInterface.sequelize.query(
      `ALTER TABLE \`${table}\` ` +
        'ALTER COLUMN `created_at` DROP DEFAULT, ' +
        'ALTER COLUMN `updated_at` DROP DEFAULT',
    );
  }
}
