import { Router } from 'express';

import staffController from '../controllers/StaffController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

router.post('/', roleAuth('manage_record'), staffController.create);
router.get('/', roleAuth('manage_record'), staffController.index);
router.get('/:id', roleAuth('manage_record'), staffController.show);
router.put('/:id', roleAuth('manage_record'), staffController.update);
router.delete('/:id', roleAuth('manage_record'), staffController.delete);

export default router;
