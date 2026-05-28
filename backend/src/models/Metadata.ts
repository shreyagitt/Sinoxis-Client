import mongoose, { Document, Schema } from "mongoose";

export interface MetadataDocument extends Document {
  artistName: string;
  trackTitle: string;
  album?: string;
  label: string;
  isrc: string;
  upc?: string;
  releaseDate?: string;
  genre?: string;
  composer?: string;
  publisher?: string;
  language?: string;
  lyrics?: string;
  contact?: string;
  explicit: boolean;
  confirm: boolean;
  artwork?: string;
  artworkId?: string;
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
}

const MetadataSchema = new Schema<MetadataDocument>(
  {
    artistName: { type: String, required: true, trim: true },
    trackTitle: { type: String, required: true, trim: true },
    album: { type: String, trim: true },
    label: { type: String, required: true, trim: true },
    isrc: { type: String, required: true, trim: true },
    upc: { type: String, trim: true },
    releaseDate: { type: String, trim: true },
    genre: { type: String, trim: true },
    composer: { type: String, trim: true },
    publisher: { type: String, trim: true },
    language: { type: String, trim: true },
    lyrics: { type: String, trim: true },
    contact: { type: String, trim: true },
    explicit: { type: Boolean, default: false },
    confirm: { type: Boolean, required: true },
    artwork: { type: String },
    artworkId: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<MetadataDocument>("Metadata", MetadataSchema);
