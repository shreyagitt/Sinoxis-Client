import { Schema, model } from "mongoose";

const ReleaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },
    subtitle: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Action Required"],
      default: "Pending",
    },

    remarks: { type: String },

    coverImage: { type: String },
    coverImageId: { type: String },

    audioFile: { type: String },
    audioFileId: { type: String },
  },
  { timestamps: true }
);

export default model("Release", ReleaseSchema);
