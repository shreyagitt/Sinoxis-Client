import mongoose, { Schema, Document } from "mongoose";

export interface ArtistDocument extends Document {
  name: string;

  mobile?: string;
  email?: string;

  spotify?: string;
  apple?: string;
  youtube?: string;

  avatar?: string;       // Cloudinary URL or Base64
  avatarId?: string;     // Cloudinary public_id

  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema = new Schema<ArtistDocument>(
  {
    name: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },

    // Contact fields
    mobile: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },

    // Social links
    spotify: { type: String, trim: true, default: "" },
    apple: { type: String, trim: true, default: "" },
    youtube: { type: String, trim: true, default: "" },

    // Avatar (Cloudinary URL or Base64)
    avatar: { type: String, default: "" },
    avatarId: { type: String, default: "" },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// Index for fast search
ArtistSchema.index({ name: 1 });

export default mongoose.model<ArtistDocument>("Artist", ArtistSchema);
