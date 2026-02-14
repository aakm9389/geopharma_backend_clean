import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // 📝 Contenu notification
    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    // 🎯 Type de ciblage
    targetType: {
      type: String,
      enum: ["user", "role", "profession", "all"],
      required: true,
    },

    // 🎯 Valeur du ciblage
    // user -> userId
    // role -> "admin" | "user"
    // profession -> "doctor" | "pharmacist" | etc
    // all -> null
    targetValue: {
      type: String,
      default: null,
    },

    // 👤 Admin qui a envoyé
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 👁️ Utilisateurs ayant lu la notif
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🕒 Date
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default mongoose.model("Notification", notificationSchema);
