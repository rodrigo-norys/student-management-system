import { Router } from 'express';

import staffController from '../controllers/StaffController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.post('/', loginRequired, roleAuth(1, 2), staffController.create);
router.get('/', loginRequired, roleAuth(1, 2, 3), staffController.index);
router.get('/:id', loginRequired, roleAuth(1, 2, 3), staffController.show);
router.put('/:id', loginRequired, roleAuth(1, 2, 3), staffController.update);
router.delete('/:id', loginRequired, roleAuth(1, 2), staffController.delete);

export default router;
