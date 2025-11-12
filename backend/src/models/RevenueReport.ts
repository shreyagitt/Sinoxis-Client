import mongoose, { Document, Schema } from "mongoose";

export interface PlatformPerformance {
  platform: string;
  streams: number;
  revenue: number;
  growth: number; // in percentage
  marketShare: number;
}

export interface ArtistRevenue {
  name: string;
  genre: string;
  totalRevenue: number;
  streaming: number;
  downloads: number;
  royalties: number;
  growth: number;
}

export interface TopTrack {
  title: string;
  artist: string;
  revenue: number;
  rank: number;
}

export interface RevenueReportDocument extends Document {
  summary: {
    totalRevenue: number;
    streamingRevenue: number;
    downloadsRevenue: number;
    royalties: number;
  };
  platformPerformance: PlatformPerformance[];
  artistRevenues: ArtistRevenue[];
  topTracks: TopTrack[];
  lastUpdated: Date;
}

const PlatformSchema = new Schema<PlatformPerformance>(
  {
    platform: String,
    streams: Number,
    revenue: Number,
    growth: Number,
    marketShare: Number,
  },
  { _id: false }
);

const ArtistSchema = new Schema<ArtistRevenue>(
  {
    name: String,
    genre: String,
    totalRevenue: Number,
    streaming: Number,
    downloads: Number,
    royalties: Number,
    growth: Number,
  },
  { _id: false }
);

const TrackSchema = new Schema<TopTrack>(
  {
    title: String,
    artist: String,
    revenue: Number,
    rank: Number,
  },
  { _id: false }
);

const RevenueReportSchema = new Schema<RevenueReportDocument>(
  {
    summary: {
      totalRevenue: Number,
      streamingRevenue: Number,
      downloadsRevenue: Number,
      royalties: Number,
    },
    platformPerformance: [PlatformSchema],
    artistRevenues: [ArtistSchema],
    topTracks: [TrackSchema],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<RevenueReportDocument>(
  "RevenueReport",
  RevenueReportSchema
);
