import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer.js';

import photoController from '../controllers/PhotoController.js';
import loginRequired from '../middlewares/loginRequired.js';

const router = new Router();
const upload = multer(multerConfig);

router.post('/:student_id', loginRequired, upload.single('photo'), photoController.create);

export default router;
