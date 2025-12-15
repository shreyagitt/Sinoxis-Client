import mongoose, { Document, Schema } from "mongoose";

export interface YouTubeClaimDocument extends Document {
  artistName: string;
  trackTitle: string;
  youtubeLink: string;
  claimType: "copyright" | "content_id" | "manual" | "other";
  claimDetails?: string;
  screenshot?: string;
  screenshotId?: string;
  additionalInfo?: string;
  confirm: boolean;
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
}

const YouTubeClaimSchema = new Schema<YouTubeClaimDocument>(
  {
    artistName: { type: String, required: true, trim: true },
    trackTitle: { type: String, required: true, trim: true },
    youtubeLink: { type: String, required: true, trim: true },
    claimType: {
      type: String,
      enum: ["copyright", "content_id", "manual", "other"],
      required: true,
    },
    claimDetails: { type: String, trim: true },
    screenshot: { type: String },
    screenshotId: { type: String },
    additionalInfo: { type: String, trim: true },
    confirm: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<YouTubeClaimDocument>("YouTubeClaim", YouTubeClaimSchema);
