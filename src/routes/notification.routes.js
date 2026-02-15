// routes/notification.routes.js
import express from 'express';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* =========================
   📩 GET notifications utilisateur connecté
   - notifications globales
   - par rôle
   - par profession
   - ou ciblées user
========================= */
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;

    const notifications = await Notification.find({
      $or: [
        { user: user.id },                 // ciblé utilisateur
        { isGlobal: true },                // global
        { targetRoles: user.role },        // par rôle
        { targetProfessions: user.profession }, // par profession
      ],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error('Erreur chargement notifications:', err);
    res.status(500).json({ message: 'Erreur chargement notifications' });
  }
});

/* =========================
   🔢 UNREAD COUNT utilisateur
========================= */
router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const user = req.user;

    const count = await Notification.countDocuments({
      $and: [
        {
          $or: [
            { user: user.id },
            { isGlobal: true },
            { targetRoles: user.role },
            { targetProfessions: user.profession },
          ],
        },
        { isRead: false },
      ],
    });

    res.json({ count });
  } catch (err) {
    console.error('Erreur unread-count:', err);
    res.status(500).json({ message: 'Erreur unread-count' });
  }
});

/* =========================
   👁️ MARK notification comme lue
========================= */
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({ message: 'Notification lue' });
  } catch (err) {
    console.error('Erreur mark-as-read:', err);
    res.status(500).json({ message: 'Erreur mark-as-read' });
  }
});

export default router;
