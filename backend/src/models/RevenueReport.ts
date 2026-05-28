import { Schema, model } from "mongoose";

const RevenueSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    source: { type: String, required: true }, // YouTube, Spotify, Withdraw etc
    date: { type: Date, required: true },
    amount: { type: Number, required: true },

    period: { type: String, default: "" }, // January 2025
    type: { type: String, enum: ["in", "withdraw"], required: true },

    // When type = withdraw
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: null,
    }
  },
  { timestamps: true }
);

export default model("Revenue", RevenueSchema);
