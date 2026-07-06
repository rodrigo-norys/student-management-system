import Sequelize, { Model } from 'sequelize';

export default class Unit extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING(50),
          defaultValue: '',
          validate: {
            len: {
              args: [3, 50],
              msg: 'Unit name must be between 3 and 50 characters.',
            },
          },
        },
        cnpj: {
          type: Sequelize.STRING(18),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'CNPJ is required.',
            },
          },
        },
        email: {
          type: Sequelize.STRING(150),
          defaultValue: '',
          validate: {
            isEmail: {
              msg: 'Invalid email address.',
            },
          },
        },
        phone: {
          type: Sequelize.STRING(15),
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Phone number is required.',
            },
          },
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive'),
          allowNull: false,
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        tableName: 'units',
        indexes: [
          {
            unique: true,
            fields: ['name'],
            name: 'units_name_unique',
          },
          {
            unique: true,
            fields: ['cnpj'],
            name: 'units_cnpj_unique',
          },
          {
            unique: true,
            fields: ['email'],
            name: 'units_email_unique',
          },
        ],
      },
    );
    return this;
  }

  static associate(models) {
    this.hasOne(models.Address, {
      foreignKey: 'unit_id',
      as: 'address',
    });

    this.hasMany(models.UnitClass, {
      foreignKey: 'unit_id',
      as: 'unit_classes',
    });

    this.belongsToMany(models.Staff, {
      through: 'staff_units',
      foreignKey: 'unit_id',
      as: 'staff_members',
    });
  }
}
