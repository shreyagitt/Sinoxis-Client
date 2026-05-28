"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRevenueController = void 0;
const RevenueAnalytics_1 = __importDefault(require("../../models/RevenueAnalytics"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
const { Parser } = require("json2csv");
exports.ClientRevenueController = {
    // ✅ GET MY ANALYTICS
    getMyAnalytics: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const analytics = await RevenueAnalytics_1.default.findOne().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: analytics || {},
        });
    }),
    exportMyAnalyticsCSV: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const analytics = await RevenueAnalytics_1.default.findOne().sort({ createdAt: -1 });
        if (!analytics) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
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
        res.header("Content-Disposition", "attachment; filename=revenue-analytics.csv");
        res.status(constants_1.HTTP_STATUS.OK).send(csv);
    }),
};
