import express from 'express';
import {
  getAllServices,
  addService,
  updateService,
  deleteService,
} from '../controllers/homecare.controller.js';

import {requireAuth} from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.get('/', getAllServices);

router.post('/', requireAuth, requireAdmin, addService);
router.put('/:id', requireAuth, requireAdmin, updateService);
router.delete('/:id', requireAuth, requireAdmin, deleteService);

export default router;
