// routes/notification.routes.js
import express from 'express';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* =========================
   GET notifications for logged-in user
========================= */
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;

    // Cherche toutes les notifications :
    // - globales
    // - ciblant le rôle de l'utilisateur
    // - ciblant la profession de l'utilisateur
    const notifications = await Notification.find({
      $or: [
        { isGlobal: true },
        { targetRoles: user.role },
        { targetProfessions: user.profession },
      ],
    })
    .sort({ createdAt: -1 }); // les plus récentes en premier

    res.json(notifications);
  } catch (err) {
    console.error('Erreur chargement notifications:', err);
    res.status(500).json({ message: 'Erreur chargement notifications' });
  }
});

export default router;
