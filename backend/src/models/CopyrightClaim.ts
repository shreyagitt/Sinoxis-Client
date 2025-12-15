import mongoose, { Schema, Document } from "mongoose";

export interface ICopyrightClaim extends Document {
  userId: mongoose.Types.ObjectId;
  platform: "YouTube" | "Facebook";
  videoLink: string;
  notes?: string;
  status: "Pending" | "Rejected" | "Released";
  createdAt: Date;
}

const copyrightClaimSchema = new Schema<ICopyrightClaim>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    platform: {
      type: String,
      enum: ["YouTube", "Facebook"],
      required: true,
    },

    videoLink: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Rejected", "Released"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICopyrightClaim>(
  "CopyrightClaim",
  copyrightClaimSchema
);
