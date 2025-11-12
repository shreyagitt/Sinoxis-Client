import { Request, Response } from "express";
import RevenueAnalytics from "../../models/RevenueAnalytics";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientRevenueController = {
  /**
   * 📊 Get Revenue Overview
   * GET /api/v1/client/revenue/overview
   */
  getOverview: asyncHandler(async (_req: Request, res: Response) => {
    const latest = await RevenueAnalytics.findOne().sort({ updatedAt: -1 });

    if (!latest) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "No revenue data found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: latest,
      message: "Revenue overview fetched successfully",
    });
  }),
};
