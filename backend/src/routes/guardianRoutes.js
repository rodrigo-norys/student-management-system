import { Router } from 'express';

import guardianController from '../controllers/GuardianController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

router.post('/', roleAuth('manage_record'), guardianController.create);
router.get('/:id', roleAuth('manage_record'), guardianController.show);
router.get('/', roleAuth('manage_record'), guardianController.index);
router.put('/:id', roleAuth('manage_record'), guardianController.update);
router.delete('/:id', roleAuth('manage_account'), guardianController.delete);

export default router;
