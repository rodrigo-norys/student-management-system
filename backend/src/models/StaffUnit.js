import Sequelize, { Model } from 'sequelize';

export default class StaffUnit extends Model {
  static init(sequelize) {
    super.init(
      {
        // Servir de `through` em belongsToMany reatribuiria a chave primária ao
        // par de FKs; declarar a surrogate preserva o `id` real da tabela.
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        staff_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        unit_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive'),
          allowNull: false,
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        tableName: 'staff_units',
        indexes: [
          {
            name: 'staff_units_index_0',
            fields: ['unit_id'],
          },
          {
            name: 'staff_units_index_1',
            unique: true,
            fields: ['staff_id', 'unit_id'],
          },
        ],
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Staff, {
      foreignKey: 'staff_id',
      as: 'staff',
    });

    this.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      as: 'unit',
    });
  }
}
