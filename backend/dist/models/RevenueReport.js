"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RevenueSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, required: true }, // YouTube, Spotify, Withdraw etc
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    period: { type: String, default: "" }, // January 2025
    type: { type: String, enum: ["in", "withdraw"], required: true },
    // When type = withdraw
    status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: null,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Revenue", RevenueSchema);
