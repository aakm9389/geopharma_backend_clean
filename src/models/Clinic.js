import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    image: {
      type: String, // /uploads/clinics/xxx.jpg
    },

    hasLab: {
      type: Boolean,
      default: false,
    },

    hasImaging: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,
      required: true, // ex: à côté du monument de l’indépendance
    },

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    insurances: {
      type: [String], // ['AMO', 'NSIA', 'Salam']
      default: [],
    },

    dialysis: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Clinic', clinicSchema);
