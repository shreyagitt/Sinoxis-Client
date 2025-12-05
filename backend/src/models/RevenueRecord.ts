import mongoose, { Schema, Document } from "mongoose";

export interface RevenueRecordDocument extends Document {
  userId: string;
  type: "income" | "withdraw";
  source?: string;
  amount: number;
  period?: string;
  status: "Pending" | "Paid" | "Failed" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface IRevenueRecord {
  _id: string;
  userId: string;
  type: "income" | "withdraw";
  source?: string;
  amount: number;
  period?: string;
  status: "Pending" | "Paid" | "Failed" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const RevenueRecordSchema = new Schema<RevenueRecordDocument>(
  {
    userId: { type: String, required: true },

    type: {
      type: String,
      enum: ["income", "withdraw"],
      required: true,
    },

    source: { type: String },

    amount: { type: Number, required: true },

    period: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Approved", "Rejected"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

const RevenueRecord = mongoose.model<RevenueRecordDocument>(
  "RevenueRecord",
  RevenueRecordSchema
);

export default RevenueRecord;
