import Sequelize, { Model } from "sequelize";

export default class Student extends Model {
  static init(sequelize) {
    super.init({
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      avatar_url: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 150],
            msg: 'Avatar URL/Path must be up to 150 characters'
          }
        }
      },
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          const avatar = this.getDataValue('avatar_url');
          return avatar ? `${process.env.APP_URL}/images/students/${avatar}` : null;
        },
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 50],
            msg: 'Name must be between 3 and 50 characters'
          },
        },
      },
      last_name: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 100],
            msg: 'Last name must be between 3 and 100 characters'
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
          },
          len: {
            args: [5, 150],
            msg: 'Email must be between 5 and 150 characters'
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
          },
          len: {
            args: [1, 20],
            msg: 'Registration number must be up to 20 characters'
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
      blood_type: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [0, 3],
            msg: 'Blood type must be up to 3 characters'
          }
        }
      },
      medical_notes: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [0, 255],
            msg: 'Medical notes must be up to 255 characters'
          }
        }
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
