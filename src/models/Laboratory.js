import mongoose from 'mongoose';

const laboratorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    // 📍 Adresse
    address: {
      type: String,
      default: '',
    },

    // 🏥 Assurances acceptées
    insurances: {
      type: [String],
      default: [],
    },

    // 🖼️ Image
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ EXPORT DU MODÈLE (OBLIGATOIRE)
const Laboratory = mongoose.model('Laboratory', laboratorySchema);
export default Laboratory;
