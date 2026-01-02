import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer.js';

import photoController from '../controllers/PhotoController.js';
import loginRequired from '../middlewares/loginRequired.js';
import validateStudentId from '../middlewares/validateStudentId.js';

const router = new Router();
const upload = multer(multerConfig);

router.post('/', loginRequired,
  upload.single('photo'),
  validateStudentId,
  photoController.create);

export default router;
