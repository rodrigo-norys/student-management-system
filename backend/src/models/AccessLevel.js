import Sequelize, { Model } from 'sequelize';

export default class AccessLevel extends Model {
  static init(sequelize) {
    super.init({
      name: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Access level name cannot be empty.',
          },
          len: {
            args: [3, 50],
            msg: 'Name must be between 3 and 50 characters.',
          },
        },
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Description cannot be empty.',
          },
          len: {
            args: [3, 255],
            msg: 'Description must be between 3 and 255 characters.',
          },
        },
      },
      manage_account: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      manage_record: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      manage_finance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: 'access_level_id',
      as: 'users'
    });
  }
}
