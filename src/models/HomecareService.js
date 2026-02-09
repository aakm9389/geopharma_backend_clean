import mongoose from 'mongoose';

const homecareServiceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['blood', 'care'], // blood = prélèvement, care = soins
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('HomecareService', homecareServiceSchema);
