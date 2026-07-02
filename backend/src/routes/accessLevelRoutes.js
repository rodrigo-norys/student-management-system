// @ts-check
import { Router } from 'express';
import accessLevelController from '../controllers/AccessLevelController.js';
import loginRequired from '../middlewares/loginRequired.js';

const router = Router();

router.use(loginRequired);

router.get('/', accessLevelController.index);

export default router;
