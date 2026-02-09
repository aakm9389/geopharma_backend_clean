import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    specialty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialty',
      required: true,
    },

    phone: {
      type: String,
      required: false,
      trim: true,
    },

    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },

    // 🔹 Nouveau : photo du médecin
    photo: {
      type: String, // stocke l'URL ou le chemin de l'image
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
