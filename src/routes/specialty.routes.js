// backend/src/routes/specialty.routes.js
import express from 'express';
import {
  getAllSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} from '../controllers/specialty.controller.js';

import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* ========== PUBLIC ========== */
router.get('/', getAllSpecialties);

/* ========== ADMIN ========== */
router.post('/', requireAuth, requireAdmin, createSpecialty);
router.put('/:id', requireAuth, requireAdmin, updateSpecialty);
router.delete('/:id', requireAuth, requireAdmin, deleteSpecialty);

export default router;
