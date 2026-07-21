import { Router } from 'express';

import subjectController from '../controllers/SubjectController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';

const router = new Router();

router.use(loginRequired);

router.post('/', roleAuth('manage_academic'), subjectController.create);
router.get('/', roleAuth('manage_academic'), subjectController.index);
router.get('/:id', roleAuth('manage_academic'), subjectController.show);
router.put('/:id', roleAuth('manage_academic'), subjectController.update);
router.delete('/:id', roleAuth('manage_academic'), subjectController.delete);

export default router;
