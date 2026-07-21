import { Router } from 'express';

import unitController from '../controllers/UnitController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

// Estática antes de /:id, senão 'lookup' seria capturado como id.
router.get('/lookup', roleAuth('manage_academic'), unitController.lookup);

router.post('/', roleAuth('manage_account'), unitController.create);
router.get('/', roleAuth('manage_record'), unitController.index);
router.get('/:id', roleAuth('manage_record'), unitController.show);
router.put('/:id', roleAuth('manage_account'), unitController.update);
router.delete('/:id', roleAuth('manage_account'), unitController.delete);

export default router;
