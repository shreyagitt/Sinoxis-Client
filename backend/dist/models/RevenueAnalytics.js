"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const platformSchema = new mongoose_1.Schema({
    icon: { type: String },
    name: { type: String },
    category: { type: String },
    streams: { type: Number },
    revenue: { type: Number },
    avgPerStream: { type: Number },
    growth: { type: Number },
    marketShare: { type: Number },
});
const revenueAnalyticsSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: "User", default: null },
    totalRevenue: Number,
    totalChange: String,
    growthAmount: Number,
    streamingRevenue: Number,
    streamingChange: String,
    streamingPercent: Number,
    streamingGrowth: Number,
    downloadsRevenue: Number,
    downloadsChange: String,
    royaltiesRevenue: Number,
    royaltiesChange: String,
    yearToDate: Number,
    currentMonth: Number,
    growthRate: String,
    revenueSources: Number,
    distribution: {
        streaming: Number,
        downloads: Number,
        royalties: Number,
    },
    platforms: [platformSchema],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("RevenueAnalytics", revenueAnalyticsSchema);
