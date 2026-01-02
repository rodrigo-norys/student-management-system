"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Studentjs = require('../models/Student.js'); var _Studentjs2 = _interopRequireDefault(_Studentjs);
var _Photojs = require('../models/Photo.js'); var _Photojs2 = _interopRequireDefault(_Photojs);

class StudentController {
  // create
  async create(req, res) {
    try {
      const newStudent = await _Studentjs2.default.create(req.body);
      return res.json(newStudent);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  // index
  async index(req, res) {
    try {
      const allStudents = await _Studentjs2.default.findAll({
        attributes: ['id', 'name', 'last_name', 'email', 'age', 'weight', 'height'],
        order: [['id', 'DESC'], [_Photojs2.default, 'id', 'DESC']],
        include: {
          model: _Photojs2.default,
          attributes: ['url', 'filename']
        }
      });
      return res.json({allStudents});
    } catch (e) {
      return res.json({ errors: e.errors.map(err => err.message) });
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['You must enter an ID']
        });
      }
      const student = await _Studentjs2.default.findByPk(id, {
        attributes: ['id', 'name', 'last_name', 'email', 'age', 'weight', 'height'],
        order: [['id', 'DESC'], [_Photojs2.default, 'id', 'DESC']],
        include: {
          model: _Photojs2.default,
          attributes: ['url', 'filename']
        },
      });

      return res.json(student);
    } catch (e) {
      return res.status(400).json({
        errors: ['Student not found']
      });
    }
  }

  // update
  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['You must enter an ID']
        });
      }
      let student = await _Studentjs2.default.findByPk(id);

      if (!student) {
        return res.status(400).json({
          errors: ['Student not found']
        });
      }
      const oldStudent = student.toJSON();

      student = await student.update(
        req.body,
        {
          where: {
            id: id
          }
        }
      );

      if (oldStudent.updated_at.toString() === student.updated_at.toString()) {
        return res.status(400).json({
          errors: ['No lines were affected']
        });
      }

      return res.json(student);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message)
      });
    }
  }

  // delete
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['You must enter an ID']
        });
      }
      const student = await _Studentjs2.default.destroy({
        where: {
          id: id
        }
      });

      if (!student) {
        return res.status(400).json({
          errors: ['Student not found']
        });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        errors: ['Student not found']
      });
    }
  }
}

exports. default = new StudentController();
