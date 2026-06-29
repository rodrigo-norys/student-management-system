import Sequelize, { Model } from 'sequelize';

export default class Staff extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          unique: {
            msg: 'This user account is already linked to another staff member.',
          },
        },
        avatar_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        full_name: {
          type: Sequelize.STRING(150),
          allowNull: false,
          validate: {
            len: {
              args: [3, 150],
              msg: 'Full name must be between 3 and 150 characters.',
            },
          },
        },
        email: {
          type: Sequelize.STRING(150),
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
          type: Sequelize.STRING(14),
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
          type: Sequelize.STRING(15),
          allowNull: false,
          validate: {
            len: {
              args: [8, 15],
              msg: 'Phone number must be between 8 and 15 characters.',
            },
          },
        },
        personal_email: {
          type: Sequelize.STRING(100),
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
          type: Sequelize.STRING(100),
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
        termination_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
          validate: {
            isDate: {
              msg: 'Invalid termination date format.',
            },
          },
        },
        medical_notes: {
          type: Sequelize.STRING(255),
          allowNull: true,
          validate: {
            len: {
              args: [0, 255],
              msg: 'Medical notes cannot exceed 255 characters.',
            },
          },
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive', 'suspended', 'on_leave'),
          allowNull: false,
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        tableName: 'staff',
      },
    );

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
