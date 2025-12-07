import mongoose, { Schema, Document, Types } from "mongoose";

export interface PaymentRequestDocument extends Document {
  userId: Types.ObjectId;
  amount: number;
  processingFee: number;
  totalReceive: number;
  method: "bank" | "paypal";
  notes?: string;
  status: "Pending" | "Paid" | "Failed";
  paymentDetails?: {
    bank?: {
      accountHolder?: string;
      accountNumber?: string;
      bankName?: string;
      routingNumber?: string;
    };
    paypal?: {
      name?: string;
      email?: string;
      paypalId?: string;
    };
  };
}

const PaymentRequestSchema = new Schema<PaymentRequestDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true },
    processingFee: { type: Number, default: 0 },
    totalReceive: { type: Number, required: true },

    method: {
      type: String,
      enum: ["bank", "paypal"],
      required: true,
    },

    notes: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paymentDetails: {
      bank: {
        accountHolder: String,
        accountNumber: String,
        bankName: String,
        routingNumber: String,
      },
      paypal: {
        name: String,
        email: String,
        paypalId: String,
      },
    },
  },
  { timestamps: true }
);

const PaymentRequest = mongoose.model<PaymentRequestDocument>(
  "PaymentRequest",
  PaymentRequestSchema
);

export default PaymentRequest;
