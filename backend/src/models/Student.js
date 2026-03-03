import Sequelize, { Model } from "sequelize";

export default class Student extends Model {
  static init(sequelize) {
    super.init({
      name: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Name must be between 3 and 255 characters'
          },
        },
      },
      last_name: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Last name must be between 3 and 255 characters'
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'Email already exists'
        },
        validate: {
          isEmail: {
            msg: 'You must enter a valid email'
          }
        },
      },
      registration_number: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'Registration number already exists'
        },
        validate: {
          notEmpty: {
            msg: 'Registration number cannot be empty'
          }
        },
      },
      cpf: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'CPF already exists'
        },
        validate: {
          len: {
            args: [11, 14],
            msg: 'CPF must be between 11 and 14 characters'
          }
        },
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        validate: {
          isDate: {
            msg: 'Invalid birth date',
          }
        },
      },
      avatar_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${process.env.APP_URL}/images/${this.getDataValue('avatar_url')}`;
        },
      },
      blood_type: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      medical_notes: {
        type: Sequelize.TEXT,
        defaultValue: ''
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.hasMany(models.Address, {
      foreignKey: 'student_id',
      as: 'addresses',
    });
  }
}
