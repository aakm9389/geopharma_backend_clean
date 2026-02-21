import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Settings from "../models/Settings.js";

/* =======================
   LOGIN GLOBAL
======================= */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(500).json({
        message: "Configuration système manquante",
      });
    }

    let validPassword = false;

    /* ========= ADMIN PASSWORD ========= */
    if (role === "admin") {
      validPassword = await bcrypt.compare(
        password,
        settings.adminPassword
      );
    }

    /* ========= USER PASSWORD ========= */
    if (role === "user") {
      validPassword = await bcrypt.compare(
        password,
        settings.userPassword
      );
    }

    if (!validPassword) {
      return res.status(401).json({
        message: "Mot de passe incorrect",
      });
    }

    /* ========= AUTO CREATE USER ========= */
    let user = await User.findOne({ email, role });

    if (!user) {
      user = await User.create({
        username: email,
        email,
        role,
        isBlocked: false,
        tokenVersion: 0,
        lastLoginAt: new Date(),
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Compte bloqué par l’administrateur",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        tokenVersion: user.tokenVersion,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profession: user.profession ?? null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   REGISTER (INCHANGÉ)
======================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: email,
      email,
      password: hashedPassword,
      role,
      profession: null,
      lastLoginAt: new Date(),
      tokenVersion: 0,
    });

    await user.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
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