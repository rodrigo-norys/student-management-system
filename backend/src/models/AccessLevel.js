import Sequelize, { Model } from 'sequelize';

export default class AccessLevel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING(30),
        description: Sequelize.STRING(150),
        hierarchy_weight: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        is_system_level: {
          type: Sequelize.TINYINT,
          defaultValue: 0,
        },
        manage_account: Sequelize.TINYINT,
        manage_record: Sequelize.TINYINT,
        manage_academic: Sequelize.TINYINT,
        manage_finance: Sequelize.TINYINT,
      },
      {
        sequelize,
        tableName: 'access_levels',
      },
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: 'access_level_id',
      as: 'users'
    });
  }
}
