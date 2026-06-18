export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('units', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    cnpj: {
      type: Sequelize.STRING(18),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(15),
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

  await queryInterface.addIndex('units', ['name'], {
    unique: true,
    name: 'units_name_unique',
  });
  await queryInterface.addIndex('units', ['cnpj'], {
    unique: true,
    name: 'units_cnpj_unique',
  });
  await queryInterface.addIndex('units', ['email'], {
    unique: true,
    name: 'units_email_unique',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('units');
}
