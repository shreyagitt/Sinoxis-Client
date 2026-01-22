import mongoose, { Document, Schema } from "mongoose";

export interface StoreDocument extends Document {
  name: string;
  platform: string;
  icon: string;
  iconId: string;
  isActive: boolean;
}

const StoreSchema = new Schema<StoreDocument>(
  {
    name: { type: String, required: true, trim: true },
    platform: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, required: true },
    iconId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<StoreDocument>("Store", StoreSchema);
