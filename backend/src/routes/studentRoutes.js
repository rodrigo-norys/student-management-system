import { Router } from 'express';

import studentController from '../controllers/StudentController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

router.post('/', roleAuth([4]), studentController.create);
router.get('/:id', roleAuth([2, 3, 4, 5]), studentController.show);
router.get('/', roleAuth([2, 3, 4, 5]), studentController.index);
router.put('/:id', roleAuth([3, 4]), studentController.update);
router.delete('/:id', roleAuth([2, 3]), studentController.delete);

export default router;
