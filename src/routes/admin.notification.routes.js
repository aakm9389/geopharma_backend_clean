// backend/src/routes/admin.notification.routes.js
import express from 'express';
import admin from '../config/firebase.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/// 📤 Créer une notification + envoyer push (ADMIN UNIQUEMENT)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      message,
      targetRoles = [],
      targetProfessions = [],
      isGlobal = false,
    } = req.body;

    /* =========================
       1️⃣ ENREGISTRER EN DB
    ========================= */
    const notification = await Notification.create({
      title,
      message,
      targetRoles,
      targetProfessions,
      isGlobal,
      createdBy: req.user.id,
    });

    /* =========================
       2️⃣ RÉCUPÉRER UTILISATEURS CIBLÉS
    ========================= */
    let users;

    if (isGlobal) {
      users = await User.find({});
    } else {
      users = await User.find({
        $or: [
          { role: { $in: targetRoles } },
          { profession: { $in: targetProfessions } },
        ],
      });
    }

    /* =========================
       3️⃣ EXTRAIRE FCM TOKENS
    ========================= */
    const tokens = users.flatMap((u) => u.fcmTokens || []);

    if (!tokens.length) {
      return res.status(201).json({
        message: 'Notification créée (aucun appareil cible)',
        notification,
      });
    }

    /* =========================
       4️⃣ ENVOI PUSH FIREBASE
    ========================= */
    await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
        body: message,
      },
      android: {
        priority: 'high',
      },
    });

    /* =========================
       5️⃣ RÉPONSE
    ========================= */
    res.status(201).json({
      message: 'Notification créée et push envoyée',
      notification,
      devices: tokens.length,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur envoi notification' });
  }
});

export default router;
