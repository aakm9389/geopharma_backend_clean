import Notification from "../models/Notification.js";
import User from "../models/User.js";
import admin from "../config/firebase.js";

/* =========================================
   🔔 ENVOI NOTIFICATION ADMIN
   POST /api/admin/notifications/send
========================================= */
export const sendNotification = async (req, res) => {
  try {
    const { title, body, targetType, targetValue } = req.body;

    if (!title || !body || !targetType) {
      return res.status(400).json({
        message: "Champs manquants",
      });
    }

    /* =====================================
       1️⃣ Sauvegarde en base
    ===================================== */
    const notif = await Notification.create({
      title,
      body,
      targetType,
      targetValue: targetValue ?? null,
      createdBy: req.user.id,
    });

    /* =====================================
       2️⃣ Récupération utilisateurs ciblés
    ===================================== */
    let users = [];

    if (targetType === "all") {
      users = await User.find({
        fcmTokens: { $exists: true, $not: { $size: 0 } },
      });
    }

    if (targetType === "user") {
      users = await User.find({
        _id: targetValue,
        fcmTokens: { $exists: true, $not: { $size: 0 } },
      });
    }

    if (targetType === "role") {
      users = await User.find({
        role: targetValue,
        fcmTokens: { $exists: true, $not: { $size: 0 } },
      });
    }

    if (targetType === "profession") {
      users = await User.find({
        profession: targetValue,
        fcmTokens: { $exists: true, $not: { $size: 0 } },
      });
    }

    /* =====================================
       3️⃣ Extraction de TOUS les tokens
       🔥 multi-appareils
    ===================================== */
    const tokens = users
      .flatMap((u) => u.fcmTokens)
      .filter((t) => t);

    /* =====================================
       4️⃣ Envoi Firebase
    ===================================== */
    if (tokens.length > 0) {
      await admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
          title,
          body,
        },
      });
    }

    res.json({
      message: "Notification envoyée",
      notification: notif,
      tokensCount: tokens.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   📥 NOTIFICATIONS UTILISATEUR
   GET /api/notifications
========================================= */
export const getUserNotifications = async (req, res) => {
  try {
    const user = req.user;

    const notifs = await Notification.find({
      $or: [
        { targetType: "all" },
        { targetType: "user", targetValue: user.id },
        { targetType: "role", targetValue: user.role },
        { targetType: "profession", targetValue: user.profession },
      ],
    }).sort({ createdAt: -1 });

    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   ✔ MARQUER COMME LU
   PATCH /api/notifications/:id/read
========================================= */
export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);

    if (!notif) {
      return res.status(404).json({
        message: "Notification introuvable",
      });
    }

    if (!notif.readBy.includes(req.user.id)) {
      notif.readBy.push(req.user.id);
      await notif.save();
    }

    res.json({ message: "Notification marquée comme lue" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   🔢 COMPTEUR NON LUES
   GET /api/notifications/unread-count
========================================= */
export const getUnreadCount = async (req, res) => {
  try {
    const user = req.user;

    const count = await Notification.countDocuments({
      $and: [
        {
          $or: [
            { targetType: "all" },
            { targetType: "user", targetValue: user.id },
            { targetType: "role", targetValue: user.role },
            { targetType: "profession", targetValue: user.profession },
          ],
        },
        {
          readBy: { $ne: user.id },
        },
      ],
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
