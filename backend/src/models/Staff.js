import Sequelize, { Model } from 'sequelize';

export default class Staff extends Model {
  static init(sequelize) {
    super.init({
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: {
          msg: 'This user account is already linked to another staff member.',
        },
      },
      avatar_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          const avatar = this.getDataValue('avatar_url');
          return avatar ? `${process.env.APP_URL}/images/staff/${avatar}` : null;
        },
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 150],
            msg: 'Full name must be between 3 and 150 characters.',
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: 'This institutional email is already in use.',
        },
        validate: {
          isEmail: {
            msg: 'Invalid institutional email format.',
          },
          len: {
            args: [5, 150],
            msg: 'Institutional email must be between 5 and 150 characters.',
          },
        },
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: 'This CPF is already registered.',
        },
        validate: {
          len: {
            args: [11, 14],
            msg: 'CPF must be between 11 and 14 characters.',
          },
        },
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'Invalid birth date.',
          },
        },
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 20],
            msg: 'Phone number must be between 8 and 20 characters.',
          },
        },
      },
      personal_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: 'This personal email is already in use.',
        },
        validate: {
          isEmail: {
            msg: 'Invalid personal email format.',
          },
          len: {
            args: [5, 100],
            msg: 'Personal email must be between 5 and 100 characters.',
          },
        },
      },
      job_title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 100],
            msg: 'Job title must be between 3 and 100 characters.',
          },
        },
      },
      hiring_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'Invalid hiring date.',
          },
        },
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
          len: {
            args: [3, 20],
            msg: 'Status must be between 3 and 20 characters.',
          },
        },
      },
      medical_notes: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 255],
            msg: 'Medical notes cannot exceed 255 characters.',
          },
        },
      },
      is_active: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: 'Invalid value for active status.',
          },
        },
      },
      termination_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        validate: {
          isDate: {
            msg: 'Invalid termination date format.',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'staff',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.hasMany(models.Address, {
      foreignKey: 'staff_id',
      as: 'addresses',
    });
  }
}
