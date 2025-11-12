import mongoose, { Document, Schema } from "mongoose";

export interface PlatformRevenue {
  name: string;
  category: string; // e.g. "Streaming", "Download"
  streams: number;
  revenue: number;
  avgPerStream: number;
  growth: number;
  marketShare: number;
}

export interface RevenueAnalyticsDocument extends Document {
  totalRevenue: number;
  streamingRevenue: number;
  downloadsRevenue: number;
  royaltiesRevenue: number;
  trends: { month: string; revenue: number }[];
  platforms: PlatformRevenue[];
  lastUpdated: Date;
}

const PlatformSchema = new Schema<PlatformRevenue>(
  {
    name: String,
    category: String,
    streams: Number,
    revenue: Number,
    avgPerStream: Number,
    growth: Number,
    marketShare: Number,
  },
  { _id: false }
);

const RevenueAnalyticsSchema = new Schema<RevenueAnalyticsDocument>(
  {
    totalRevenue: { type: Number, required: true },
    streamingRevenue: { type: Number, required: true },
    downloadsRevenue: { type: Number, required: true },
    royaltiesRevenue: { type: Number, required: true },
    trends: [
      {
        month: String,
        revenue: Number,
      },
    ],
    platforms: [PlatformSchema],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<RevenueAnalyticsDocument>(
  "RevenueAnalytics",
  RevenueAnalyticsSchema
);
