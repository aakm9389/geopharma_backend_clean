import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },

    latitude: Number,
    longitude: Number,

    // 🔥 PLANNING DE GARDE
    guardStartDate: {
      type: Date,
      required: true,
    },
    guardEndDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pharmacy", pharmacySchema);
