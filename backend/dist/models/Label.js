"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LabelSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    labelName: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true },
    youtube: { type: String, default: "" },
    language: { type: String, required: true },
    // Aadhar Images
    aadharFront: { type: String, default: null },
    aadharFrontId: { type: String, default: null },
    aadharBack: { type: String, default: null },
    aadharBackId: { type: String, default: null },
    // Status like your UI
    status: {
        type: String,
        enum: ["Active", "Pending", "Rejected", "Inactive"],
        default: "Pending",
    },
    // Created & expiry (5 years auto)
    createdAt: { type: Date, default: Date.now },
    expires: { type: Date },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" }, // client id
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Label", LabelSchema);
