import { Router } from 'express';

import unitController from '../controllers/UnitController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

router.post('/', roleAuth('manage_account'), unitController.create);
router.get('/', roleAuth('manage_record'), unitController.index);
router.get('/:id', roleAuth('manage_record'), unitController.show);
router.put('/:id', roleAuth('manage_account'), unitController.update);
router.delete('/:id', roleAuth('manage_account'), unitController.delete);

export default router;
