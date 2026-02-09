import express from 'express';
import {
  listMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from '../controllers/medicine.controller.js';

import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

/// Public
router.get('/', listMedicines);

/// Admin
router.post('/', requireAuth, requireAdmin, createMedicine);
router.put('/:id', requireAuth, requireAdmin, updateMedicine);
router.delete('/:id', requireAuth, requireAdmin, deleteMedicine);

export default router;
