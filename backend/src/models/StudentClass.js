import Sequelize, { Model } from 'sequelize';

export default class StudentClass extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        unit_class_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        enrollment_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        enrollment_status: {
          type: Sequelize.ENUM(
            'active',
            'inactive',
            'transferred',
            'dropped_out',
            'graduated',
          ),
          defaultValue: 'active',
          validate: {
            isIn: {
              args: [
                [
                  'active',
                  'inactive',
                  'transferred',
                  'dropped_out',
                  'graduated',
                ],
              ],
              msg: 'Invalid enrollment status.',
            },
          },
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive'),
          allowNull: false,
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        tableName: 'student_classes',
        indexes: [
          {
            name: 'student_classes_index_0',
            unique: true,
            fields: ['student_id', 'unit_class_id'],
          },
          {
            name: 'student_classes_index_1',
            fields: ['unit_class_id'],
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

    this.belongsTo(models.UnitClass, {
      foreignKey: 'unit_class_id',
      as: 'unit_class',
    });

    this.hasMany(models.StudentGrade, {
      foreignKey: 'student_classes_id',
      as: 'grades',
    });
  }
}
