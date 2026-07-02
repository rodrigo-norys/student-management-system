// @ts-check
import { Router } from 'express';

import studentController from '../controllers/StudentController.js';
import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = Router();

router.use(loginRequired);

router.post('/', roleAuth('manage_record'), studentController.create);
router.get('/', studentController.index);
router.get('/:id', studentController.show);
router.put('/:id', roleAuth('manage_record'), studentController.update);
router.delete('/:id', roleAuth('manage_record'), studentController.delete);

export default router;
