import { Router } from 'express';

import staffController from '../controllers/StaffController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.post(
  '/',
  loginRequired,
  roleAuth('manage_record'),
  staffController.create,
);
router.get(
  '/',
  loginRequired,
  roleAuth('manage_record'),
  staffController.index,
);
router.get(
  '/:id',
  loginRequired,
  roleAuth('manage_record'),
  staffController.show,
);
router.put(
  '/:id',
  loginRequired,
  roleAuth('manage_record'),
  staffController.update,
);
router.delete(
  '/:id',
  loginRequired,
  roleAuth('manage_account'),
  staffController.delete,
);

export default router;
