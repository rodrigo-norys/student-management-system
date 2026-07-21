import { Router } from 'express';

import unitClassController from '../controllers/UnitClassController.js';

import loginRequired from '../middlewares/loginRequired.js';
import roleAuth from '../middlewares/roleAuth.js';
import minWeight from '../middlewares/minWeight.js';
import { ACADEMIC_STRUCTURE_MIN_WEIGHT } from '../utils/hierarchy.js';

const router = new Router();

router.use(loginRequired);

const canManageStructure = minWeight(ACADEMIC_STRUCTURE_MIN_WEIGHT);

router.post(
  '/',
  roleAuth('manage_academic'),
  canManageStructure,
  unitClassController.create,
);
router.get('/', roleAuth('manage_academic'), unitClassController.index);
router.get('/:id', roleAuth('manage_academic'), unitClassController.show);
router.put(
  '/:id',
  roleAuth('manage_academic'),
  canManageStructure,
  unitClassController.update,
);
router.delete(
  '/:id',
  roleAuth('manage_academic'),
  canManageStructure,
  unitClassController.delete,
);

export default router;
