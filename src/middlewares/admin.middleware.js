// backend/src/middlewares/admin.middleware.js

export const requireAdmin = (req, res, next) => {
  // 🔐 requireAuth doit être exécuté avant
  if (!req.user) {
    return res.status(401).json({
      message: 'Non authentifié',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Accès admin requis',
    });
  }

  next();
};
