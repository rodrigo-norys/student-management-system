"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Photo = require('../models/Photo'); var _Photo2 = _interopRequireDefault(_Photo);

class PhotoController {
  async create(req, res) {
     try {
        const { originalname, filename } = req.file;
        const { student_id } = req.body;
        const photo = await _Photo2.default.create({ originalname, filename, student_id });
        return res.json(photo);
      } catch (e) {
        return res.status(400).json({
          errors: ['Student cannot be found']
        });
      }
    };
  }

exports. default = new PhotoController();
