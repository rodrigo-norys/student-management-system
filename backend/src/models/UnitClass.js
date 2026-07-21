import Sequelize, { Model } from 'sequelize';

export default class UnitClass extends Model {
  static init(sequelize) {
    super.init(
      {
        unit_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Unit is required.',
            },
          },
        },
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: '',
          validate: {
            notNull: {
              msg: 'Class identifier/name is required.',
            },
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
          allowNull: false,
          defaultValue: '',
          validate: {
            notNull: {
              msg: 'Grade level is required.',
            },
            notEmpty: {
              msg: 'Grade level is required.',
            },
            len: {
              args: [1, 50],
              msg: 'Grade level must be between 1 and 50 characters.',
            },
          },
        },
        room_number: {
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: '',
          validate: {
            notNull: {
              msg: 'Room number is required.',
            },
            notEmpty: {
              msg: 'Room number is required.',
            },
            len: {
              args: [1, 20],
              msg: 'Room number must be between 1 and 20 characters.',
            },
          },
        },
        shift: {
          type: Sequelize.STRING(15),
          allowNull: false,
          defaultValue: '',
          validate: {
            notNull: {
              msg: 'Shift is required.',
            },
            notEmpty: {
              msg: 'Shift is required.',
            },
            len: {
              args: [1, 15],
              msg: 'Shift must be between 1 and 15 characters.',
            },
          },
        },
        school_year: {
          type: Sequelize.STRING(45),
          allowNull: false,
          defaultValue: '',
          validate: {
            notNull: {
              msg: 'School year is required.',
            },
            notEmpty: {
              msg: 'School year is required.',
            },
            len: {
              args: [1, 45],
              msg: 'School year must be between 1 and 45 characters.',
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
            max: {
              args: [10000],
              msg: 'Max students must not exceed 10000.',
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
