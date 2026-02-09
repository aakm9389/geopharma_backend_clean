import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';

const router = express.Router();

/// 📲 Enregistrer appareil (FCM token)
router.post('/register-device', requireAuth, async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM token requis' });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { fcmTokens: fcmToken }, // évite doublons
    });

    res.json({ message: 'Device enregistré' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur enregistrement device' });
  }
});

export default router;
