import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import app from "./src/app.js";
import Settings from "./src/models/Settings.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/* =========================
   ✅ INIT GLOBAL PASSWORDS
========================= */
const initSettings = async () => {
  try {
    const existing = await Settings.findOne();

    if (!existing) {
      const adminHash = await bcrypt.hash("@dmin2025", 10);
      const userHash = await bcrypt.hash("user2025", 10);

      await Settings.create({
        adminPassword: adminHash,
        userPassword: userHash,
      });

      console.log("✅ Default global passwords created");
    }
  } catch (err) {
    console.error("❌ Settings init error:", err.message);
  }
};

/* =========================
   ✅ MONGODB CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connecté");

    await initSettings();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err.message);
  });