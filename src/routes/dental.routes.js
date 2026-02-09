import express from 'express';
import {
  getByCity,
  addCabinet,
  updateCabinet,
  deleteCabinet,
} from '../controllers/dental.controller.js';

import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';
import { uploadDentalImage } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getByCity);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadDentalImage.single('image'),
  addCabinet
);

router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  uploadDentalImage.single('image'),
  updateCabinet
);

router.delete('/:id', requireAuth, requireAdmin, deleteCabinet);

export default router;
