import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* ==========================
   ADMIN CHANGE USER PASSWORD
========================== */
router.put('/users/:id/password', requireAuth, async (req, res) => {
  try {
    // seulement admin autorisé
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'Mot de passe requis' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // hash
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
