import { Router } from 'express';
import userController from '../controllers/UserController.js';

import loginRequired from '../middlewares/loginRequired.js';

const router = new Router();

router.get('/', userController.index);
router.get('/:id', userController.show);

router.post('/',userController.create);
router.put('/', loginRequired, userController.update);
router.delete('/', loginRequired, userController.delete);

export default router;
