import express from 'express';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; // ✅

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;

    const notifications = await Notification.find({
      $or: [
        { isGlobal: true },
        { targetRoles: user.role },
        { targetProfessions: user.profession },
      ],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération notifications' });
  }
});

export default router;
