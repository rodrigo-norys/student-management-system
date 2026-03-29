import Sequelize, { Model } from 'sequelize';

export default class StudentGuardian extends Model {
  static init(sequelize) {
    super.init({
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      guardian_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      relationship_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          len: {
            args: [2, 20],
            msg: 'Relationship type must be between 2 and 20 characters.',
          },
        },
      },
      is_financial_resp: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: 'Invalid value for financial responsibility status.',
          },
        },
      },
    }, {
      sequelize,
      tableName: 'student_guardians',
    });

    return this;
  }
}
