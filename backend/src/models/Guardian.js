import Sequelize, { Model } from 'sequelize';

export default class Guardian extends Model {
  static init(sequelize) {
    super.init({
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
      },
      name: {
        type: Sequelize.STRING(50),
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
        validate: {
          len: {
            args: [8, 15],
            msg: 'Phone number must be between 8 and 15 characters.',
          },
        },
      },
      email: {
        type: Sequelize.STRING(100),
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
    }, {
      sequelize,
      tableName: 'guardians',
    });

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
