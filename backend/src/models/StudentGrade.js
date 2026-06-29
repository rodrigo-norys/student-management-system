import Sequelize, { Model } from 'sequelize';

export default class StudentGrade extends Model {
  static init(sequelize) {
    super.init(
      {
        class_allocation_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        student_classes_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        grade_1: {
          type: Sequelize.DECIMAL(4, 2),
          defaultValue: 0.0,
          validate: {
            min: 0,
            max: 10,
          },
        },
        grade_2: {
          type: Sequelize.DECIMAL(4, 2),
          defaultValue: 0.0,
          validate: {
            min: 0,
            max: 10,
          },
        },
        grade_3: {
          type: Sequelize.DECIMAL(4, 2),
          defaultValue: 0.0,
          validate: {
            min: 0,
            max: 10,
          },
        },
        grade_4: {
          type: Sequelize.DECIMAL(4, 2),
          defaultValue: 0.0,
          validate: {
            min: 0,
            max: 10,
          },
        },
        final_average: {
          type: Sequelize.DECIMAL(4, 2),
          defaultValue: 0.0,
          validate: {
            min: 0,
            max: 10,
          },
        },
        absences: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        subject_status: {
          type: Sequelize.ENUM('studying', 'approved', 'failed', 'recovery'),
          defaultValue: 'studying',
          validate: {
            isIn: {
              args: [['studying', 'approved', 'failed', 'recovery']],
              msg: 'Invalid subject status.',
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
        tableName: 'student_grades',
        indexes: [
          {
            name: 'student_grades_index_0',
            unique: true,
            fields: ['student_classes_id', 'class_allocation_id'],
          },
        ],
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ClassAllocation, {
      foreignKey: 'class_allocation_id',
      as: 'allocation',
    });
    
    this.belongsTo(models.StudentClass, {
      foreignKey: 'student_classes_id',
      as: 'enrollment',
    });
  }
}
