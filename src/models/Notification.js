import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    // 🎯 Ciblage par rôle
    targetRoles: [
      {
        type: String,
        enum: ['admin', 'user'],
      },
    ],

    // 🎯 Ciblage par profession
    targetProfessions: [
      {
        type: String,
        enum: ['doctor', 'pharmacist', 'student', 'other'],
      },
    ],

    // 🌍 Notification globale ?
    isGlobal: {
      type: Boolean,
      default: false,
    },

    // 👤 Créée par admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // 🕒 Date de création
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

export default mongoose.model('Notification', notificationSchema);
