import { Router } from 'express';
import avatarController from '../controllers/AvatarController.js';

import multer from 'multer';
import multerConfig from '../config/multer.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const upload = multer(multerConfig);
const router = new Router();

router.use(loginRequired);

router.patch(
  '/:userType/:id',
  roleAuth('manage_record'),
  upload.single('avatar'),
  avatarController.create,
);

export default router;
