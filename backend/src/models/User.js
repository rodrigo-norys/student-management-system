import { Sequelize, Model } from "sequelize";
import bcryptjs from "bcryptjs";

export default class User extends Model {
  static init(sequelize) {
    super.init({
      access_level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'access_levels',
          key: 'id'
        }
      },
      avatar_url: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 255],
            msg: 'Avatar URL must be up to 255 characters'
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'This email already exists'
        },
        validate: {
          isEmail: {
            msg: 'Enter a valid email'
          },
          len: {
            args: [5, 150],
            msg: 'Email must be between 5 and 150 characters'
          }
        }
      },
      password_hash: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [0, 100],
            msg: 'Password hash limit exceeded'
          }
        }
      },
      password: {
        type: Sequelize.VIRTUAL,
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'Password must be between 6 and 50 characters'
          }
        }
      },
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          const avatar = this.getDataValue('avatar_url');
          return avatar ? `${process.env.APP_URL}/images/${avatar}` : null;
        },
      },
      is_active: {
        type: Sequelize.TINYINT,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: 'is_active must be TRUE or FALSE'
          }
        }
      },
      is_temporary: {
        type: Sequelize.TINYINT,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: 'is_temporary must be TRUE or FALSE'
          }
        }
      }
    }, {
      sequelize,
    });

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    return this;
  }

  passwordIsValid(password) {
    return bcryptjs.compare(password, this.password_hash);
  }

  static associate(models) {
    this.hasMany(models.Student, {
      foreignKey: 'user_id',
      as: 'students'
    });

    this.belongsTo(models.AccessLevel, {
      foreignKey: 'access_level_id',
      as: 'access_level'
    });
  }
}
