import { Router } from 'express';
import tokenController from '../controllers/TokenController.js';

import loginRequired from '../middlewares/loginRequired.js';

const router = new Router();

router.post('/', tokenController.create);
router.delete('/', tokenController.delete);

router.get('/validate', loginRequired, tokenController.validate);

export default router;
