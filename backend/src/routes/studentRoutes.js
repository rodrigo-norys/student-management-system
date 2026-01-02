import { Router } from 'express';
import studentController from '../controllers/StudentController.js';

import loginRequired from '../middlewares/loginRequired.js';

const router = new Router();

router.get('/', studentController.index);
router.get('/:id', loginRequired, studentController.show);
router.post('/', studentController.create);
router.put('/:id', loginRequired, studentController.update);
router.delete('/:id', loginRequired, studentController.delete);

export default router;
