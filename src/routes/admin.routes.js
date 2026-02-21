import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Settings from "../models/Settings.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

import {
  changeUserPassword,
  changeGlobalUserPassword,
  changeGlobalAdminPassword,
} from "../controllers/admin.controller.js";

import { sendNotification } from "../controllers/notification.controller.js";

const router = express.Router();

/* ==========================
   👤 USERS CONNECTÉS (ADMIN)
   GET /api/admin/users
========================== */
router.get(
  "/admin/users",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await User.find(
        {},
        {
          email: 1,
          lastLoginAt: 1,
          role: 1,
          profession: 1,
          isBlocked: 1,
        }
      ).sort({ lastLoginAt: -1 });

      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ==========================
   🔒 BLOCK / UNBLOCK USER
========================== */
router.patch(
  "/admin/users/:id/block",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "Utilisateur introuvable",
        });
      }

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.json({
        message: user.isBlocked
          ? "Utilisateur bloqué"
          : "Utilisateur débloqué",
        isBlocked: user.isBlocked,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ==========================
   🔑 CHANGE PASSWORD (1 USER)
========================== */
router.put(
  "/admin/users/:id/password",
  requireAuth,
  requireAdmin,
  changeUserPassword
);

/* ==========================
   🔔 ENVOI NOTIFICATION ADMIN
========================== */
router.post(
  "/admin/notifications/send",
  requireAuth,
  requireAdmin,
  sendNotification
);

/* =======================================================
   🔐 CHANGE GLOBAL USER PASSWORD
   (Tous les USERS utilisent ce password)
======================================================= */
router.post(
  "/change-global-user-password",
  requireAuth,
  requireAdmin,
  changeGlobalUserPassword
);

/* =======================================================
   🔐 CHANGE GLOBAL ADMIN PASSWORD
======================================================= */
router.post(
  "/change-global-admin-password",
  requireAuth,
  requireAdmin,
  changeGlobalAdminPassword
);

/* =======================================================
   🔐 LEGACY ROUTE (COMPATIBILITÉ)
   Invalidation JWT seulement
======================================================= */
router.post(
  "/change-global-password",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      /* ✅ Déconnexion forcée */
      await User.updateMany(
        {},
        {
          $inc: { tokenVersion: 1 },
        }
      );

      res.json({
        message:
          "Tous les utilisateurs ont été déconnectés",
      });
    } catch (err) {
      console.error("Erreur invalidation tokens:", err);

      res.status(500).json({
        message: "Erreur serveur",
      });
    }
  }
);

export default router;