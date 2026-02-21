import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Settings from "../models/Settings.js";

/* ==========================
   CHANGE USER PASSWORD (OLD)
========================== */
export const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        message: "Mot de passe invalide",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      message: "Mot de passe utilisateur modifié",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================
   GLOBAL USER PASSWORD
========================== */
export const changeGlobalUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const settings = await Settings.findOne();

    const same = await bcrypt.compare(
      newPassword,
      settings.adminPassword
    );

    if (same)
      return res.status(400).json({
        message: "Même password que admin interdit",
      });

    settings.userPassword =
      await bcrypt.hash(newPassword, 10);

    await settings.save();

    res.json({
      message: "Mot de passe global USER modifié",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================
   GLOBAL ADMIN PASSWORD
========================== */
export const changeGlobalAdminPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const settings = await Settings.findOne();

    const same = await bcrypt.compare(
      newPassword,
      settings.userPassword
    );

    if (same)
      return res.status(400).json({
        message: "Même password que user interdit",
      });

    settings.adminPassword =
      await bcrypt.hash(newPassword, 10);

    await settings.save();

    res.json({
      message: "Mot de passe global ADMIN modifié",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};