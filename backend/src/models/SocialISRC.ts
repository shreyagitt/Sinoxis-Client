import mongoose, { Document, Schema } from "mongoose";

export interface SocialISRCDocument extends Document {
  artistNameSocial: string;
  labelName?: string;
  facebookLink?: string;
  instagramLink?: string;
  spotifyLink?: string;
  appleMusicLink?: string;
  isrcCode: string;
  trackTitleSocial?: string;
  officialVideoUrlSocial?: string;
  confirmSocial: boolean;
  status: "Pending" | "Reviewed" | "Approved" | "Rejected";
}

const SocialISRCSchema = new Schema<SocialISRCDocument>(
  {
    artistNameSocial: { type: String, required: true, trim: true },
    labelName: { type: String, trim: true },
    facebookLink: { type: String, trim: true },
    instagramLink: { type: String, trim: true },
    spotifyLink: { type: String, trim: true },
    appleMusicLink: { type: String, trim: true },
    isrcCode: { type: String, required: true, trim: true },
    trackTitleSocial: { type: String, trim: true },
    officialVideoUrlSocial: { type: String, trim: true },
    confirmSocial: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<SocialISRCDocument>("SocialISRC", SocialISRCSchema);
