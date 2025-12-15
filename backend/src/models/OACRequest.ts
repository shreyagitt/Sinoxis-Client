import mongoose, { Schema, Document } from "mongoose";

export interface ISong {
  title: string;
  isrc: string;
}

export interface IOACRequest extends Document {
  ytChannel: string;
  topicChannel?: string;
  artistName: string;
  songs: ISong[];
  status: "Submitted" | "Approved" | "Rejected" | "Released";
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>({
  title: { type: String, required: true },
  isrc: { type: String, required: true },
});

const OACRequestSchema = new Schema<IOACRequest>(
  {
    ytChannel: { type: String, required: true },
    topicChannel: { type: String, default: "" },
    artistName: { type: String, required: true },

    songs: {
      type: [SongSchema],
      validate: {
        validator: (v: ISong[]) => v.length >= 3,
        message: "Minimum 3 songs are required",
      },
    },

    status: {
      type: String,
      enum: ["Submitted", "Approved", "Rejected", "Released"],
      default: "Submitted",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOACRequest>("OACRequest", OACRequestSchema);
