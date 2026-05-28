"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: false, // ✅ MUST BE FALSE
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Notification", NotificationSchema);
