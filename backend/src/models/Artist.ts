import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // UI fields
    genre: { type: String, default: "" },
    label: { type: String, default: "" },
    followers: { type: Number, default: 0 },
    bio: { type: String, default: "" },

    // Social links
    spotify: { type: String, default: "" },
    instagram: { type: String, default: "" },

    // Status used by UI: Active / Inactive
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // Cloudinary data
    artistImage: { type: String, default: "" },   // image URL
    artistImageId: { type: String, default: "" }, // image public_id

  },
  { timestamps: true }
);

export default mongoose.model("Artist", ArtistSchema);
