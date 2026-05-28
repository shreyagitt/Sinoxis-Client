import mongoose, { Document, Schema } from "mongoose";

export interface GenreDocument extends Document {
  name: string;
  icon: string;
  iconId: string;
  isActive: boolean;
}

const GenreSchema = new Schema<GenreDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
     icon: { type: String, default: null },
    iconId: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<GenreDocument>("Genre", GenreSchema);