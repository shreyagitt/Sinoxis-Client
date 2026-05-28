import mongoose, { Document, Schema } from "mongoose";

export interface FacebookVideoDocument extends Document {
  artistNameFb: string;
  labelNameFb?: string;
  facebookVideoUrl: string;
  isrcCodeFb: string;
  claimTypeFb: string;
  claimDetailsFb?: string;
  screenshotFb?: string;
  screenshotFbId?: string;
  confirmFb: boolean;
  status: "Pending" | "Reviewed" | "Resolved" | "Rejected";
}

const FacebookVideoSchema = new Schema<FacebookVideoDocument>(
  {
    artistNameFb: { type: String, required: true, trim: true },
    labelNameFb: { type: String, trim: true },
    facebookVideoUrl: { type: String, required: true, trim: true },
    isrcCodeFb: { type: String, required: true, trim: true },
    claimTypeFb: { type: String, required: true, trim: true },
    claimDetailsFb: { type: String, trim: true },
    screenshotFb: { type: String },
    screenshotFbId: { type: String },
    confirmFb: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Resolved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<FacebookVideoDocument>(
  "FacebookVideo",
  FacebookVideoSchema
);
