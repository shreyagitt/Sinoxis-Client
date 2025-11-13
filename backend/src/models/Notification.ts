import mongoose, { Document, Schema } from "mongoose";

export interface NotificationDocument extends Document {
  userId?: string; // null if broadcast to all users
  title: string;
  desc: string;
  time: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: String, default: null }, // for targeted or broadcast
    title: { type: String, required: true },
    desc: { type: String, required: true },
    time: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema
);
