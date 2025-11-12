import mongoose, { Schema, Document } from "mongoose";

export interface IBankDetails extends Document {
  userId: mongoose.Types.ObjectId;
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  bankBranch?: string;
  panNumber?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BankDetailsSchema = new Schema<IBankDetails>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankBranch: { type: String },
    panNumber: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBankDetails>("BankDetails", BankDetailsSchema);
