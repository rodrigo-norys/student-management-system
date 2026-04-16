import { Router } from 'express';

import guardianController from '../controllers/GuardianController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

router.post('/', roleAuth([4]), guardianController.create);
router.get('/:id', roleAuth([2, 3, 4, 5]), guardianController.show);
router.get('/', roleAuth([2, 3, 4, 5]), guardianController.index);
router.put('/:id', roleAuth([3, 4]), guardianController.update);
router.delete('/:id', roleAuth([2, 3]), guardianController.delete);

export default router;
