import mongoose, { Document, Schema } from "mongoose";

export interface PaymentRequestDocument extends Document {
  userId: string;
  amount: number;
  method: "bank" | "paypal";
  notes?: string;
  processingFee: number;
  tax: number;
  totalReceive: number;
  deliveryTime: string;
  status: "Pending" | "Processing" | "Completed" | "Rejected";
  accountDetails?: {
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    routingNumber?: string;
    paypalEmail?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRequestSchema = new Schema<PaymentRequestDocument>(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["bank", "paypal"], required: true },
    notes: { type: String },
    processingFee: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalReceive: { type: Number, required: true },
    deliveryTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Rejected"],
      default: "Pending",
    },
    accountDetails: {
      bankName: String,
      accountHolder: String,
      accountNumber: String,
      routingNumber: String,
      paypalEmail: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<PaymentRequestDocument>(
  "PaymentRequest",
  PaymentRequestSchema
);
