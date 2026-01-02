"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Userjs = require('../models/User.js'); var _Userjs2 = _interopRequireDefault(_Userjs);

class UserController {
  // create
  async create(req, res) {
    try {
      const newUser = await _Userjs2.default.create(req.body);
      const { id, name, email } = newUser
      return res.json({ id, name, email });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message)
      });
    }
  }

  // index
  async index(req, res) {
    try {
      const allUsers = await _Userjs2.default.findAll({ attributes: ['id', 'name', 'email']});
      return res.json(allUsers);
    } catch (error) {
      return res.json(null);
    }
  }

  // show
  async show(req, res) {
    try {
      const user = await _Userjs2.default.findByPk(req.params.id);

      const { id, name, email } = user;
      return res.json({ id, name, email});
    } catch (error) {
      return res.json(null);
    }
  }

  // update
  async update(req, res) {
    try {
      const user = await _Userjs2.default.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({
          errors: ['User not found'],
        })
      }

      const newData = await user.update(req.body)
      const { id, name, email } = newData

      return res.json({ id, name, email });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  // delete
  async delete(req, res) {
    try {
      const user = await _Userjs2.default.findByPk(req.userID);

      if (!user) {
        return res.status(400).json({
          errors: ['User not found'],
        })
      }

      await user.destroy()
      return res.json(null);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message)
      });
    }
  }
}

exports. default = new UserController();
