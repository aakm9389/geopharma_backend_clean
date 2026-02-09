import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

import {
  getAll,
  create,
  update,
  remove,
} from "../controllers/establishment.controller.js";

const router = express.Router();

/// 📥 GET — Public
router.get("/", getAll);

/// ➕ POST — Create (ADMIN)
router.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.single("image"), // ✅ DOIT matcher Flutter
  create
);

/// ✏️ PUT — Update (ADMIN)
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  update
);

/// 🗑️ DELETE — Remove (ADMIN)
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  remove
);

export default router;
