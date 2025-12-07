import { Schema, model, Types } from "mongoose";

const platformSchema = new Schema({
  icon: { type: String },
  name: { type: String },
  category: { type: String },
  streams: { type: Number },
  revenue: { type: Number },
  avgPerStream: { type: Number },
  growth: { type: Number },
  marketShare: { type: Number },
});

const revenueAnalyticsSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", default: null  },

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
  },
  { timestamps: true }
);

export default model("RevenueAnalytics", revenueAnalyticsSchema);

