import Sequelize, { Model } from 'sequelize';

export default class UnitClass extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING(20),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Class identifier/name is required.',
            },
            len: {
              args: [1, 20],
              msg: 'Class identifier must be between 1 and 20 characters.',
            },
          },
        },
        grade_level: {
          type: Sequelize.STRING(50),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Grade level is required.',
            },
          },
        },
        room_number: {
          type: Sequelize.STRING(20),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Room number is required.',
            },
          },
        },
        shift: {
          type: Sequelize.STRING(15),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Shift is required.',
            },
          },
        },
        school_year: {
          type: Sequelize.STRING(45),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'School year is required.',
            },
          },
        },
        max_students: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          validate: {
            isInt: {
              msg: 'Max students must be an integer.',
            },
            min: {
              args: [1],
              msg: 'Class must support at least 1 student.',
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
        tableName: 'unit_classes',
        indexes: [
          {
            name: 'unit_classes_index_0',
            unique: true,
            fields: ['unit_id', 'room_number', 'shift', 'school_year'],
          },
          {
            name: 'unit_classes_index_1',
            unique: true,
            fields: ['unit_id', 'name', 'school_year'],
          },
          {
            name: 'unit_classes_index_2',
            fields: ['grade_level'],
          },
        ],
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      as: 'unit',
    });

    this.belongsToMany(models.Student, {
      through: 'student_classes',
      foreignKey: 'unit_class_id',
      as: 'students',
    });

    this.hasMany(models.ClassAllocation, {
      foreignKey: 'unit_class_id',
      as: 'allocations',
    });
  }
}
