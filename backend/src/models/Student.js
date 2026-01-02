import { Sequelize, Model } from "sequelize";

export default class Student extends Model {
  static init(sequelize) {
    super.init({
      name: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 20],
            msg: 'Name must be between 3 and 50 characters'
          }
        }
      },
      last_name: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 30],
            msg: 'Last name must be between 3 and 50 characters'
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          isEmail: {
            msg: 'You must enter a valid email'
          }
        }
      },
      age: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.FLOAT,
        defaultValue: 0,
        validate: {
          isFloat: {
            msg: 'You must enter a valid weight'
          }
        }
      },
      height: {
        type: Sequelize.FLOAT,
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
}
