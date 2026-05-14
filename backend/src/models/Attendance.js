import Sequelize, { Model } from 'sequelize';

export default class Attendance extends Model {
  static init(sequelize) {
    super.init(
      {
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        status: {
          type: Sequelize.ENUM('present', 'absent', 'justified'),
          defaultValue: 'present',
        },
        notes: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        is_active: {
          type: Sequelize.TINYINT,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: 'attendances',
        indexes: [
          {
            name: 'attendances_index_0',
            unique: true,
            fields: ['student_id', 'class_allocation_id', 'date'],
          },
          {
            name: 'attendances_index_1',
            fields: ['date'],
          },
        ],
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student',
    });

    this.belongsTo(models.ClassAllocation, {
      foreignKey: 'class_allocation_id',
      as: 'allocation',
    });
  }
}
