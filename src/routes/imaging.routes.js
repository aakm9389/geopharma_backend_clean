import express from 'express';
import {
  getByCity,
  addCenter,
  updateCenter,
  deleteCenter,
} from '../controllers/imaging.controller.js';

import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.get('/', getByCity);
router.post('/', requireAuth, requireAdmin, addCenter);
router.put('/:id', requireAuth, requireAdmin, updateCenter);
router.delete('/:id', requireAuth, requireAdmin, deleteCenter);

export default router;
