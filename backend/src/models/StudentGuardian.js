import Sequelize, { Model } from 'sequelize';

export default class StudentGuardian extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        guardian_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        relationship_type: {
          type: Sequelize.STRING(30),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Relationship type is required.',
            },
          },
        },
        is_financial_resp: {
          type: Sequelize.TINYINT,
          defaultValue: 0,
        },
        is_emergency_contact: {
          type: Sequelize.TINYINT,
          defaultValue: 0,
        },
        is_active: {
          type: Sequelize.TINYINT,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: 'student_guardians',
        indexes: [
          {
            name: 'student_guardians_index_0',
            fields: ['guardian_id'],
          },
          {
            name: 'student_guardians_index_1',
            fields: ['student_id'],
          },
        ],
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student',
    });

    this.belongsTo(models.Guardian, {
      foreignKey: 'guardian_id',
      as: 'guardian',
    });
  }
}
