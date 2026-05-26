import Sequelize, { Model } from 'sequelize';

export default class Subject extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING(50),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Subject name is required.',
            },
            len: {
              args: [3, 50],
              msg: 'Subject name must be between 3 and 50 characters.',
            },
          },
        },
        code: {
          type: Sequelize.STRING(10),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Subject code is required.',
            },
          },
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        knowledge_area: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        is_elective: {
          type: Sequelize.TINYINT,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive'),
          allowNull: false,
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        tableName: 'subjects',
        indexes: [
          {
            name: 'subjects_index_0',
            unique: true,
            fields: ['name'],
          },
          {
            name: 'subjects_index_1',
            unique: true,
            fields: ['code'],
          },
          {
            name: 'subjects_index_2',
            fields: ['knowledge_area'],
          },
        ],
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.ClassAllocation, {
      foreignKey: 'subject_id',
      as: 'allocations',
    });
  }
}
