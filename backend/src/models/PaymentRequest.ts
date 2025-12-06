import mongoose from "mongoose";

const PaymentRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true },
    processingFee: { type: Number, default: 0 },
    totalReceive: { type: Number },

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

export default mongoose.model("PaymentRequest", PaymentRequestSchema);
