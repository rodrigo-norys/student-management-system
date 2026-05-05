import Sequelize, { Model } from 'sequelize';

export default class Guardian extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          unique: {
            msg: 'This user account is already linked to another guardian.',
          },
        },
        avatar_url: {
          type: Sequelize.STRING(150),
          allowNull: true,
          validate: {
            len: {
              args: [0, 150],
              msg: 'Avatar URL/Path must be up to 150 characters',
            },
          },
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            const avatar = this.getDataValue('avatar_url');
            return avatar
              ? `${process.env.APP_URL}/images/guardians/${avatar}`
              : null;
          },
        },
        name: {
          type: Sequelize.STRING(50),
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [2, 50],
              msg: 'Name must be between 2 and 50 characters.',
            },
          },
        },
        last_name: {
          type: Sequelize.STRING(50),
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [2, 50],
              msg: 'Last name must be between 2 and 50 characters.',
            },
          },
        },
        cpf: {
          type: Sequelize.STRING(14),
          defaultValue: '',
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
        phone: {
          type: Sequelize.STRING(15),
          allowNull: false,
          defaultValue: '',
          set(value) {
            const rawValue = String(value).replace(/\D/g, '');
            this.setDataValue('phone', rawValue);
          },
          validate: {
            isNumeric: {
              msg: 'Phone number must contain only digits.',
            },
            len: {
              args: [10, 15],
              msg: 'Phone number must be between 10 and 15 digits.',
            },
          },
        },
        email: {
          type: Sequelize.STRING(100),
          defaultValue: '',
          allowNull: false,
          unique: {
            msg: 'This email is already in use.',
          },
          validate: {
            isEmail: {
              msg: 'Invalid email format.',
            },
            len: {
              args: [5, 100],
              msg: 'Email must be between 5 and 100 characters.',
            },
          },
        },
      },
      {
        sequelize,
        tableName: 'guardians',
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
      foreignKey: 'guardian_id',
      as: 'addresses',
    });

    this.belongsToMany(models.Student, {
      through: models.StudentGuardian,
      foreignKey: 'guardian_id',
      otherKey: 'student_id',
      as: 'students',
    });
  }
}
