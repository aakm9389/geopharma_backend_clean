import express from "express";
import {
  getOnDutyPharmacies,
  getPharmacies,       // ✅ OK
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
} from "../controllers/pharmacy.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/* =======================
   USER
======================= */

/// ✅ LISTE DE TOUTES LES PHARMACIES
router.get("/", getPharmacies);

/// Pharmacies de garde
/// Exemple : /api/pharmacies/guard?date=2025-01-20&city=Bamako
router.get("/guard", getOnDutyPharmacies);

/* =======================
   ADMIN
======================= */
router.post("/", requireAuth, requireAdmin, createPharmacy);
router.put("/:id", requireAuth, requireAdmin, updatePharmacy);
router.delete("/:id", requireAuth, requireAdmin, deletePharmacy);

export default router;
