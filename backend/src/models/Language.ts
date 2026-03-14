import mongoose, { Schema, Document } from "mongoose";

export interface LanguageDocument extends Document {
  name: string;
  isActive: boolean;
}

const LanguageSchema = new Schema<LanguageDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<LanguageDocument>("Language", LanguageSchema);