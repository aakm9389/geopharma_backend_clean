import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* ==========================
   🔐 AUTHENTIFICATION REQUISE
   Vérifie JWT + tokenVersion
========================== */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔐 Pas de header
    if (!authHeader) {
      return res.status(401).json({
        message: 'Token manquant',
      });
    }

    // 🔐 Format invalide
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Token invalide',
      });
    }

    const token = authHeader.split(' ')[1];

    // 🔐 Vérification JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 On récupère l'utilisateur en base
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'Utilisateur introuvable',
      });
    }

    /* ==========================
       🔥 INVALIDATION DES TOKENS
       Si tokenVersion différent :
       -> token ancien
       -> utilisateur déconnecté
    ========================== */
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        message: "Session expirée, reconnectez-vous",
      });
    }

    // ✅ Injection utilisateur complet dans la requête
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Token expiré ou invalide',
    });
  }
};

/* ==========================
   👑 ADMIN UNIQUEMENT
========================== */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Non authentifié',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Accès réservé aux administrateurs',
    });
  }

  next();
};
