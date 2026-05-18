import { Router } from 'express';
import userController from '../controllers/UserController.js';
import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

import { validateRequest } from '../middlewares/validateRequest.js';
import { userValidationSchema } from '../schemas/userSchema.js';

const router = new Router();

router.use(loginRequired);

router.put('/setup-password', validateRequest(userValidationSchema), userController.setupPassword);
router.get('/search-targets', roleAuth('manage_account'), userController.searchTargets);

router.post('/', roleAuth('manage_account'), userController.create);
router.get('/:id', userController.show);
router.get('/', roleAuth('manage_account'), userController.index);
router.put('/:id', userController.update);
router.delete('/:id', roleAuth('manage_account'), userController.delete);

export default router;
