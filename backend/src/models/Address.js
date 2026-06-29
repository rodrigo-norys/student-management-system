import Sequelize, { Model } from 'sequelize';

export default class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        zip_code: {
          type: Sequelize.STRING(9),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'CEP cannot be empty',
            },
            is: {
              args: /^[0-9]{5}-?[0-9]{3}$/,
              msg: 'Invalid CEP. Format must be 99999-999 or 99999999',
            },
          },
        },
        street: {
          type: Sequelize.STRING(100),
          defaultValue: '',
          validate: {
            len: {
              args: [1, 100],
              msg: 'Street must be between 1 and 100 characters',
            },
          },
        },
        number: {
          type: Sequelize.STRING(10),
          defaultValue: '',
          validate: {
            len: {
              args: [1, 10],
              msg: 'Number must be between 1 and 10 characters',
            },
          },
        },
        complement: {
          type: Sequelize.STRING(100),
          allowNull: true,
          validate: {
            len: {
              args: [0, 100],
              msg: 'Complement must be a maximum of 100 characters',
            },
          },
        },
        neighborhood: {
          type: Sequelize.STRING(100),
          defaultValue: '',
          validate: {
            len: {
              args: [1, 100],
              msg: 'Neighborhood must be between 1 and 100 characters',
            },
          },
        },
        city: {
          type: Sequelize.STRING(100),
          defaultValue: '',
          validate: {
            len: {
              args: [1, 100],
              msg: 'City must be between 1 and 100 characters',
            },
          },
        },
        state: {
          type: Sequelize.STRING(2),
          defaultValue: '',
          validate: {
            len: {
              args: [2, 2],
              msg: 'State must have exactly 2 characters (e.g., RJ)',
            },
          },
        },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        guardian_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        staff_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        unit_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student',
    });

    this.belongsTo(models.Staff, {
      foreignKey: 'staff_id',
      as: 'staff',
    });

    this.belongsTo(models.Guardian, {
      foreignKey: 'guardian_id',
      as: 'guardian',
    });

    this.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      as: 'unit',
    });
  }
}
