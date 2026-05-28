import mongoose, { Document, Schema } from "mongoose";

export interface SubGenreDocument extends Document {
  name: string;
  genreId: mongoose.Types.ObjectId;
  isActive: boolean;
}

const SubGenreSchema = new Schema<SubGenreDocument>(
  {
    name: { type: String, required: true, trim: true },
    genreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<SubGenreDocument>("SubGenre", SubGenreSchema);