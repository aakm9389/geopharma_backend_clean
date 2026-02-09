import mongoose from "mongoose";

const MedicalEstablishmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "Clinique",
        "Polyclinique",
        "Cabinet médical",
        "Centre médical",
      ],
      required: true,
    },

    city: { type: String, required: true },

    address: { type: String },

    phone: { type: String },

    hasLaboratory: { type: Boolean, default: false },
    hasImaging: { type: Boolean, default: false },
    hasDialysis: { type: Boolean, default: false },

    insurances: {
    type: [String],
    default: [],
  },
    /**
     * 📍 Localisation OpenStreetMap
     * Format : "latitude,longitude"
     */
    mapLocation: {
      type: String,
      match: /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/,
    },

    googleMapUrl: { type: String },

    /**
     * 🖼️ Image établissement
     */
    image: { type: String },
  },
  { timestamps: true }
);

const MedicalEstablishment = mongoose.model(
  "MedicalEstablishment",
  MedicalEstablishmentSchema
);

export default MedicalEstablishment;
