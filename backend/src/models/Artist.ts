import mongoose, { Schema, Document } from "mongoose";

export interface ArtistDocument extends Document {
  name: string;
  genre?: string;
  label?: string;
  followers: number;
  bio?: string;

  spotify?: string;
  instagram?: string;

  status: "Active" | "Inactive";

  artistImage?: string;     // Cloudinary URL
  artistImageId?: string;   // Cloudinary public_id

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

    // UI fields
    genre: { type: String, trim: true, default: "" },
    label: { type: String, trim: true, default: "" },
    followers: { type: Number, default: 0, min: 0 },

    bio: { type: String, trim: true, default: "" },

    // Social links
    spotify: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },

    // Active / Inactive toggle
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // Cloudinary image support
    artistImage: { type: String, default: "" },     // URL
    artistImageId: { type: String, default: "" },   // Public ID
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// Improve performance on filtering
ArtistSchema.index({ name: 1 });

export default mongoose.model<ArtistDocument>("Artist", ArtistSchema);
