import { Schema, model } from "mongoose";

const LabelSchema = new Schema(
  {
    fullName: { type: String, required: true },
    labelName: { type: String, required: true },

    email: { type: String, default: "" },
    phone: { type: String, required: true },
    youtube: { type: String, default: "" },
    language: { type: String, required: true },

    // Aadhar Images
    aadharFront: { type: String, default: null },
    aadharFrontId: { type: String, default: null },

    aadharBack: { type: String, default: null },
    aadharBackId: { type: String, default: null },

    // Status like your UI
    status: {
      type: String,
      enum: ["Active", "Pending", "Rejected", "Inactive"],
      default: "Pending",
    },

    // Created & expiry (5 years auto)
    created: { type: Date, default: Date.now },
    expiry: { type: Date },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // client id
  },
  { timestamps: true }
);

export default model("Label", LabelSchema);
