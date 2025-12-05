import mongoose, { Document, Schema } from "mongoose";

export interface ApplyFormDocument extends Document {
  fullName: string;
  artistName: string;
  email: string;
  phone: string;
  instagram?: string;
  youtube?: string;
  labelName?: string;
  releasedBefore: boolean;
  heardAbout: string;

  status: "Pending" | "Approved" | "Rejected";
}

const ApplyFormSchema = new Schema<ApplyFormDocument>(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },

    artistName: {
      type: String,
      required: [true, "Artist Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    instagram: { type: String },

    youtube: { type: String },

    labelName: { type: String },

    releasedBefore: {
      type: Boolean,
      required: true,
    },

    heardAbout: {
      type: String,
      required: [true, "Source information is required"],
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// indexing for performance
ApplyFormSchema.index({ email: 1 });

export default mongoose.model<ApplyFormDocument>(
  "ApplyForm",
  ApplyFormSchema
);
