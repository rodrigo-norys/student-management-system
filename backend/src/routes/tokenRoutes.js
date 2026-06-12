import { Router } from 'express';
import tokenController from '../controllers/TokenController.js';

import loginRequired from '../middlewares/loginRequired.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = new Router();

router.post('/', loginLimiter, tokenController.create);
router.post('/demo', tokenController.createDemo);

router.get('/validate', loginRequired, tokenController.validate);
router.delete('/', tokenController.delete);

export default router;
