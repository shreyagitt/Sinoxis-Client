import mongoose, { Document, Schema } from "mongoose";

export interface YouTubeOACDocument extends Document {
  channelName: string;
  channelUrl: string;
  topicUrl?: string;
  officialVideoUrl: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
}

const YouTubeOACSchema = new Schema<YouTubeOACDocument>(
  {
    channelName: { type: String, required: true, trim: true },
    channelUrl: { type: String, required: true, trim: true },
    topicUrl: { type: String, trim: true },
    officialVideoUrl: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<YouTubeOACDocument>("YouTubeOAC", YouTubeOACSchema);
