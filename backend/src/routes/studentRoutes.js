import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer.js';

import studentController from '../controllers/StudentController.js';
import avatarController from '../controllers/AvatarController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();
const upload = multer(multerConfig);

router.use(loginRequired);

router.post('/', roleAuth([4]), studentController.create);
router.get('/:id', roleAuth([2, 3, 4, 5]), studentController.show);
router.get('/', roleAuth([2, 3, 4, 5]), studentController.index);
router.put('/:id', roleAuth([3, 4]), studentController.update);
router.patch('/avatar/:id', roleAuth([4]), upload.single('avatar'), avatarController.create);
router.delete('/:id', roleAuth([]), studentController.delete);

export default router;
