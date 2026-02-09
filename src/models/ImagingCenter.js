import mongoose from 'mongoose';

const imagingCenterSchema = new mongoose.Schema(
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
    },

    address: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    /// 🛡️ ASSURANCES ACCEPTÉES
    insurances: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('ImagingCenter', imagingCenterSchema);
