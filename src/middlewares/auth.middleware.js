// backend/src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Injection utilisateur
    // decoded = { role, email, id? }
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token expiré ou invalide',
    });
  }
};

/**
 * 👑 ADMIN UNIQUEMENT
 */
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
