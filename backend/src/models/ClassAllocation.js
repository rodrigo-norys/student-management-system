import Sequelize, { Model } from 'sequelize';

export default class ClassAllocation extends Model {
  static init(sequelize) {
    super.init(
      {
        staff_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        unit_class_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        subject_id: {
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
        tableName: 'class_allocations',
        indexes: [
          {
            name: 'class_allocations_index_0',
            unique: true,
            fields: ['unit_class_id', 'subject_id'],
          },
          {
            name: 'class_allocations_index_1',
            fields: ['staff_id'],
          },
        ],
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Staff, {
      foreignKey: 'staff_id',
      as: 'teacher',
    });

    this.belongsTo(models.UnitClass, {
      foreignKey: 'unit_class_id',
      as: 'unit_class',
    });

    this.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject',
    });

    this.hasMany(models.Attendance, {
      foreignKey: 'class_allocation_id',
      as: 'attendances',
    });
  }
}
