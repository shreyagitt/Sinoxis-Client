import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: String,
    email: String,
    phone: String,
    label: String,
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },

    // Cloudinary stored information
    artistImage: String,
    artistImageId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Artist", ArtistSchema);
