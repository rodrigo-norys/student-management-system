"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize');

 class Student extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      name: {
        type: _sequelize.Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 20],
            msg: 'Name must be between 3 and 50 characters'
          }
        }
      },
      last_name: {
        type: _sequelize.Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 30],
            msg: 'Last name must be between 3 and 50 characters'
          }
        }
      },
      email: {
        type: _sequelize.Sequelize.STRING,
        defaultValue: '',
        validate: {
          isEmail: {
            msg: 'You must enter a valid email'
          }
        }
      },
      age: {
        type: _sequelize.Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          len: {
            args: [1, 2],
            msg: 'You must enter a valid age'
          },
          isInt: {
            msg: 'You must enter a number',
          }
        }
      },
      weight: {
        type: _sequelize.Sequelize.FLOAT,
        defaultValue: 0,
        validate: {
          isFloat: {
            msg: 'You must enter a valid weight'
          }
        }
      },
      height: {
        type: _sequelize.Sequelize.FLOAT,
        defaultValue: 0,
        validate: {
          isFloat: {
            msg: 'You must enter a valid height'
          }
        }
      },
    }, {
      sequelize,
    });
    return this;
  }

 static associate(models) {
    this.hasMany(models.Photo, { foreignKey: 'student_id'})
  }
} exports.default = Student;
