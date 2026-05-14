export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('staff_units', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    staff_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'staff', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    unit_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'units', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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

  await queryInterface.addIndex('staff_units', ['unit_id'], {
    name: 'staff_units_index_0',
  });

  await queryInterface.addIndex('staff_units', ['staff_id', 'unit_id'], {
    unique: true,
    name: 'staff_units_index_1',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('staff_units');
}
