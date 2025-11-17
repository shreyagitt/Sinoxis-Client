import { Schema, model } from "mongoose";

const LabelSchema = new Schema(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    followers: { type: String, default: "0" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    labelImage: { type: String, default: null },
    labelImageId: { type: String, default: null },
  },
  { timestamps: true }
);

export default model("Label", LabelSchema);
