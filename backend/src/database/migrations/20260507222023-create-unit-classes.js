export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('unit_classes', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    unit_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'units',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    grade_level: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    room_number: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    shift: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    school_year: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    max_students: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  // Índice de Conflito Espacial (Sala ocupada)
  await queryInterface.addIndex(
    'unit_classes',
    ['unit_id', 'room_number', 'shift', 'school_year'],
    {
      unique: true,
      name: 'unit_classes_index_0',
    },
  );

  // Índice de Identidade (Nome da turma único por unidade/ano)
  await queryInterface.addIndex(
    'unit_classes',
    ['unit_id', 'name', 'school_year'],
    {
      unique: true,
      name: 'unit_classes_index_1',
    },
  );

  // Índice Simples para buscas por nível escolar
  await queryInterface.addIndex('unit_classes', ['grade_level'], {
    name: 'unit_classes_index_2',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('unit_classes');
}
