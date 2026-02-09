import mongoose from 'mongoose';

const dentalCabinetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model('DentalCabinet', dentalCabinetSchema);
