import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    /* =====================================
       🧑‍⚕️ PROFESSION (ciblage notifications)
    ===================================== */
    profession: {
      type: String,
      enum: ["doctor", "pharmacist", "student", "other"],
      default: null,
    },

    /* =====================================
       🔔 TOKENS FCM (multi-appareils)
    ===================================== */
    fcmTokens: [
      {
        type: String,
      },
    ],

    /* =====================================
       🔒 Blocage utilisateur
    ===================================== */
    isBlocked: {
      type: Boolean,
      default: false,
    },

    /* =====================================
       🕒 Dernière connexion
    ===================================== */
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================
   🛡️ Protection OverwriteModelError
===================================== */
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
