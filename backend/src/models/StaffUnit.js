import Sequelize, { Model } from 'sequelize';

export default class StaffUnit extends Model {
  static init(sequelize) {
    super.init(
      {
        is_active: {
          type: Sequelize.TINYINT,
          defaultValue: 1,
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
