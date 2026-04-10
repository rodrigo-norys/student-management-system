import { Router } from 'express';
import tokenController from '../controllers/TokenController.js';

import loginRequired from '../middlewares/loginRequired.js';

const router = new Router();

router.post('/', tokenController.create);

router.get('/validate', loginRequired, tokenController.validate);
router.delete('/', tokenController.delete);

export default router;
