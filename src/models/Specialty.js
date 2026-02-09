// backend/src/models/Specialty.js
import mongoose from 'mongoose';

const specialtySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,          // ✅ empêche les doublons
    },
  },
  {
    timestamps: true,        // createdAt / updatedAt
  }
);

// ✅ index pour de meilleures performances
specialtySchema.index({ name: 1 });

const Specialty = mongoose.model('Specialty', specialtySchema);

export default Specialty;
