import bcrypt from "bcryptjs";
import User from "../models/User.js";

/* ==========================
   🔑 CHANGE USER PASSWORD
   PUT /api/admin/users/:id/password
========================== */
export const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        message: "Mot de passe invalide (min 4 caractères)",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    // 🔐 hash nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
