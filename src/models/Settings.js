import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    adminPassword: {
      type: String,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", SettingsSchema);