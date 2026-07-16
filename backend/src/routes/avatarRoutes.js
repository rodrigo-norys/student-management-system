import { Router } from 'express';
import avatarController from '../controllers/AvatarController.js';

import multer from 'multer';
import multerConfig from '../config/multer.js';

import loginRequired from '../middlewares/loginRequired.js';
import avatarAuth from '../middlewares/avatarAuth.js';

const upload = multer(multerConfig);
const router = new Router();

router.use(loginRequired);

// avatarAuth precede o upload: autorizar depois do multer gravaria em disco o
// arquivo de quem leva 403.
router.patch(
  '/:userType/:id',
  avatarAuth,
  upload.single('avatar'),
  avatarController.create,
);

export default router;
