import express from 'express';
import {
  getByCity,
  addLab,
  updateLab,
  deleteLab,
} from '../controllers/laboratory.controller.js';

import { requireAuth } from '../middlewares/auth.middleware.js';   // ✅ CORRECTION
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

/// 👤 USER + ADMIN
router.get('/', getByCity);

/// 👨‍💼 ADMIN
router.post('/', requireAuth, requireAdmin, addLab);
router.put('/:id', requireAuth, requireAdmin, updateLab);
router.delete('/:id', requireAuth, requireAdmin, deleteLab);

export default router;
