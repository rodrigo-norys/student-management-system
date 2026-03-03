import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer.js';

import studentController from '../controllers/StudentController.js';
import avatarController from '../controllers/AvatarController.js';

import loginRequired from '../middlewares/loginRequired.js';

const router = new Router();
const upload = multer(multerConfig);

router.get('/', loginRequired, studentController.index);
router.get('/:id', loginRequired, studentController.show);
router.post('/', loginRequired, studentController.create);
router.put('/:id', loginRequired, studentController.update);
router.patch('/avatar/:id', loginRequired, upload.single('avatar'), avatarController.create);
router.delete('/:id', loginRequired, studentController.delete);

export default router;
