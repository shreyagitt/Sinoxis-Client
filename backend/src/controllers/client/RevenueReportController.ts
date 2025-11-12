import { Request, Response } from "express";
import RevenueReport from "../../models/RevenueReport";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientRevenueReportController = {
  /**
   * 📊 Get Latest Revenue Report
   * GET /api/v1/client/revenue-report
   */
  getReport: asyncHandler(async (_req: Request, res: Response) => {
    const report = await RevenueReport.findOne().sort({ updatedAt: -1 });

    if (!report) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "No revenue report found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Revenue report fetched successfully",
      data: report,
    });
  }),
};
