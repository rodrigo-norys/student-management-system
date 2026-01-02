"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Student = require('../models/Student'); var _Student2 = _interopRequireDefault(_Student);

exports. default = async (req, res, next) => {
  try {
    const { student_id } = req.body;

    const teste = await _Student2.default.findByPk(student_id)
    if (!teste) {
      return res.status(400).json({
        errors: ['Student not found (Middleware validation)']
      });
    }
    return next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errors: ['Erroorrrrrrr'] });
  }
}
