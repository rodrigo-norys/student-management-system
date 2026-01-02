"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multerjs = require('../config/multer.js'); var _multerjs2 = _interopRequireDefault(_multerjs);

var _PhotoControllerjs = require('../controllers/PhotoController.js'); var _PhotoControllerjs2 = _interopRequireDefault(_PhotoControllerjs);
var _loginRequiredjs = require('../middlewares/loginRequired.js'); var _loginRequiredjs2 = _interopRequireDefault(_loginRequiredjs);
var _validateStudentIdjs = require('../middlewares/validateStudentId.js'); var _validateStudentIdjs2 = _interopRequireDefault(_validateStudentIdjs);

const router = new (0, _express.Router)();
const upload = _multer2.default.call(void 0, _multerjs2.default);

router.post('/', _loginRequiredjs2.default,
  upload.single('photo'),
  _validateStudentIdjs2.default,
  _PhotoControllerjs2.default.create);

exports. default = router;
