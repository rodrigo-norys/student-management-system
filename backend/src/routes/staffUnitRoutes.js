import { Router } from 'express';

import staffUnitController from '../controllers/StaffUnitController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

router.post('/', roleAuth('manage_account'), staffUnitController.create);
router.get('/', roleAuth('manage_record'), staffUnitController.index);
router.get('/:id', roleAuth('manage_record'), staffUnitController.show);
router.put('/:id', roleAuth('manage_account'), staffUnitController.update);
router.delete('/:id', roleAuth('manage_account'), staffUnitController.delete);

export default router;
