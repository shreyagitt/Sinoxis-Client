import { Schema, model, Types } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: false,   // ✅ MUST BE FALSE
  default: null,
    },

    title: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    time: {
      type: String, // formatted time for UI
      default: () => new Date().toLocaleString(),
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    roleTarget: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
  },
  { timestamps: true }
);

export default model("Notification", NotificationSchema);
