import { Router } from 'express';
import userController from '../controllers/UserController.js';
import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

router.post('/', roleAuth([2]), userController.create);
router.get('/:id', userController.show);
router.get('/', roleAuth([2]), userController.index);
router.put('/:id', userController.update);
router.delete('/:id', roleAuth([2]), userController.delete);

export default router;
