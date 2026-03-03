import { Router } from 'express';
import userController from '../controllers/UserController.js';

import loginRequired from '../middlewares/loginRequired.js';

const router = new Router();

router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/',userController.create);
router.put('/:id', loginRequired, userController.update);
router.delete('/:id', loginRequired, userController.delete);

export default router;
