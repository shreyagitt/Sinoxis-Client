import { Request, Response } from "express";
import RevenueAnalytics from "../models/RevenueAnalytics";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminRevenueController = {
  /**
   * 🧾 Create or Update Revenue Analytics
   * POST /api/v1/revenue
   */
  upsert: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    const updated = await RevenueAnalytics.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Revenue analytics updated successfully",
      data: updated,
    });
  }),

  /**
   * 📋 Get All Revenue Records
   * GET /api/v1/revenue
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const records = await RevenueAnalytics.find().sort({ updatedAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data: records });
  }),

  /**
   * ❌ Delete All Revenue Records (for cleanup)
   * DELETE /api/v1/revenue
   */
  deleteAll: asyncHandler(async (_req: Request, res: Response) => {
    await RevenueAnalytics.deleteMany();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "All revenue analytics deleted successfully",
    });
  }),
};
