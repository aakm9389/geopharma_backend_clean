import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/* =======================
   LOGIN
======================= */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    /* ======================
       🔐 ADMIN LOGIN SÉCURISÉ
    ====================== */
    if (role === 'admin') {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: 'Administrateur introuvable',
        });
      }

      // 🔑 vérification mot de passe hashé
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: 'Mot de passe incorrect',
        });
      }

      // ✅ MAJ dernière connexion
      user.lastLoginAt = new Date();
      await user.save();

      const token = jwt.sign(
        {
          id: user._id,
          role: 'admin',
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: 'admin',
          profession: null,
        },
      });
    }

    /* ======================
       🔐 USER LOGIN SÉCURISÉ
    ====================== */
    if (role === 'user') {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: 'Utilisateur introuvable',
        });
      }

      // 🔒 COMPTE BLOQUÉ
      if (user.isBlocked) {
        return res.status(403).json({
          message: 'Compte bloqué par l’administrateur',
        });
      }

      // 🔑 vérification mot de passe hashé
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: 'Mot de passe incorrect',
        });
      }

      // ✅ MAJ dernière connexion
      user.lastLoginAt = new Date();
      await user.save();

      const token = jwt.sign(
        {
          id: user._id,
          role: 'user',
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: 'user',
          profession: user.profession ?? null,
        },
      });
    }

    return res.status(401).json({
      message: 'Email ou mot de passe incorrect',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   REGISTER
======================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: 'Tous les champs sont obligatoires' });
    }

    // ❌ Email déjà utilisé
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // 🔐 hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: email,
      email,
      password: hashedPassword,
      role,
      profession: role === 'admin' ? null : null,
      lastLoginAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profession: user.profession,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
