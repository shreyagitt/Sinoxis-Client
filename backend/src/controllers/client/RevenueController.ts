import { Request, Response } from "express";
import RevenueAnalytics from "../../models/RevenueAnalytics";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

const { Parser } = require("json2csv");


export const ClientRevenueController = {
  // ✅ GET MY ANALYTICS
  getMyAnalytics: asyncHandler(async (req: Request, res: Response) => {
     const analytics = await RevenueAnalytics.findOne().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: analytics || {},
  });
}),

exportMyAnalyticsCSV: asyncHandler(async (req: Request, res: Response) => {
    const analytics = await RevenueAnalytics.findOne().sort({ createdAt: -1 });

    if (!analytics) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "No analytics data found",
      });
    }

    // ✅ FLATTEN DATA FOR CSV
    const data = [
      {
        totalRevenue: analytics.totalRevenue,
        totalChange: analytics.totalChange,
        growthAmount: analytics.growthAmount,

        streamingRevenue: analytics.streamingRevenue,
        streamingChange: analytics.streamingChange,
        streamingPercent: analytics.streamingPercent,
        streamingGrowth: analytics.streamingGrowth,

        downloadsRevenue: analytics.downloadsRevenue,
        downloadsChange: analytics.downloadsChange,

        royaltiesRevenue: analytics.royaltiesRevenue,
        royaltiesChange: analytics.royaltiesChange,

        yearToDate: analytics.yearToDate,
        currentMonth: analytics.currentMonth,
        growthRate: analytics.growthRate,
        revenueSources: analytics.revenueSources,

        distributionStreaming: analytics.distribution?.streaming,
        distributionDownloads: analytics.distribution?.downloads,
        distributionRoyalties: analytics.distribution?.royalties,
      },
    ];

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.header(
      "Content-Disposition",
      "attachment; filename=revenue-analytics.csv"
    );

    res.status(HTTP_STATUS.OK).send(csv);
  }),
};
