import express from 'express';
import {
  getDoctorsBySpecialty,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctor.controller.js';

import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';
import { uploadDoctorImage } from '../middlewares/upload.middleware.js';

const router = express.Router();

/// ===============================
/// 📌 PUBLIC
/// ===============================

// 🔹 Liste des médecins par spécialité
router.get(
  '/specialties/:id/doctors',
  getDoctorsBySpecialty
);

/// ===============================
/// 🛠️ ADMIN
/// ===============================

// ➕ Ajouter un médecin (AVEC PHOTO)
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadDoctorImage.single('photo'),
  createDoctor
);

// ✏️ Modifier un médecin (AVEC PHOTO)
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  uploadDoctorImage.single('photo'),
  updateDoctor
);

// ❌ Supprimer un médecin
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  deleteDoctor
);

export default router;
