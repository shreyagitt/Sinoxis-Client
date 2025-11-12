import mongoose, { Document, Schema } from "mongoose";

export interface ApplicationDocument extends Document {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  genre: string;
  musicLink: string;
  bio: string;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
  agree: boolean;
}

const ApplicationSchema = new Schema<ApplicationDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    genre: { type: String, required: true },
    musicLink: { type: String, required: true },
    bio: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
    agree: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ApplicationDocument>("Application", ApplicationSchema);
