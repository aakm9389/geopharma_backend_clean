import express from "express";
import User from "../models/User.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

import { changeUserPassword } from "../controllers/admin.controller.js";
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
   PATCH /api/admin/users/:id/block
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
   🔑 CHANGE PASSWORD
   PUT /api/admin/users/:id/password
========================== */
router.put(
  "/admin/users/:id/password",
  requireAuth,
  requireAdmin,
  changeUserPassword
);

/* ==========================
   🔔 ENVOI NOTIFICATION ADMIN
   POST /api/admin/notifications/send
========================== */
router.post(
  "/admin/notifications/send",
  requireAuth,
  requireAdmin,
  sendNotification
);

export default router;
