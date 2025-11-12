import { Request, Response } from "express";
import RevenueReport from "../models/RevenueReport";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminRevenueReportController = {
  /**
   * 🧾 Create or Update Revenue Report
   * POST /api/v1/revenue-report
   */
  upsert: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    const updated = await RevenueReport.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Revenue report updated successfully",
      data: updated,
    });
  }),

  /**
   * 📋 Get All Reports (Admin)
   * GET /api/v1/revenue-report
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const reports = await RevenueReport.find().sort({ updatedAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data: reports });
  }),

  /**
   * ❌ Delete All Reports
   * DELETE /api/v1/revenue-report
   */
  deleteAll: asyncHandler(async (_req: Request, res: Response) => {
    await RevenueReport.deleteMany();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "All revenue reports deleted successfully",
    });
  }),
};
