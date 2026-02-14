import Sequelize, { Model } from "sequelize";

export default class Addresses extends Model {
  static init(sequelize) {
    super.init({
      zip_code: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: "CEP cannot be empty"
          },
          is: {
            args: /^[0-9]{5}-?[0-9]{3}$/,
            msg: "Invalid CEP. Format must be 99999-999 or 99999999"
          }
        }
      },
      street: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [1, 100],
            msg: "Street must be between 1 and 100 characters"
          }
        }
      },
      number: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [1, 10],
            msg: "Number must be between 1 and 10 characters"
          }
        }
      },
      complement: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 100],
            msg: "Complement must be a maximum of 100 characters"
          }
        }
      },
      neighborhood: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [1, 100],
            msg: "Neighborhood must be between 1 and 100 characters"
          }
        }
      },
      city: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [1, 100],
            msg: "City must be between 1 and 100 characters"
          }
        }
      },
      state: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [2, 2],
            msg: "State must have exactly 2 characters (e.g., RJ)"
          }
        }
      },
    }, {
      sequelize,
    });
    return this;
  }
}
