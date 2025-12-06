import { Schema, model } from "mongoose";

const ReleaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    /* ==== FRONTEND BASIC FIELDS ==== */
    title: { type: String, required: true },
    artist: { type: String, required: true },

    /* ==== FRONTEND EXTRA FIELDS ==== */
    label: { type: String },           // frontend uses label
    isrc: { type: String },            // frontend uses ISRC
    upc: { type: String },             // frontend uses UPC

    /* ==== COVER IMAGE ==== */
    cover: { type: String },           // URL displayed in UI
    coverImageId: { type: String },    // cloudinary public id

    /* ==== STATUS ==== */
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Inactive",
        "Unfinished",
        "Action Required",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default model("Release", ReleaseSchema);
