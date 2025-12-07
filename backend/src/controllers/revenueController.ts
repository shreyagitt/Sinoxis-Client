import { Request, Response } from "express";
import RevenueAnalytics from "../models/RevenueAnalytics";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminRevenueController = {

  // ✅ CREATE ANALYTICS (ADMIN ONLY)
  createAnalytics: asyncHandler(async (req: Request, res: Response) => {
    const analytics = await RevenueAnalytics.create(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Revenue analytics created successfully",
      data: analytics,
    });
  }),

  // ✅ GET ALL ANALYTICS
  getAllAnalytics: asyncHandler(async (_req: Request, res: Response) => {
    const analytics = await RevenueAnalytics.find().populate(
      "userId",
      "fullName email"
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: analytics.length,
      data: analytics,
    });
  }),

  // ✅ GET SINGLE ANALYTICS BY ID
  getSingleAnalytics: asyncHandler(async (req: Request, res: Response) => {
    const analytics = await RevenueAnalytics.findById(req.params.id).populate(
      "userId",
      "fullName email"
    );

    if (!analytics) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Analytics not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: analytics,
    });
  }),

  // ✅ UPDATE ANALYTICS
  updateAnalytics: asyncHandler(async (req: Request, res: Response) => {
    const analytics = await RevenueAnalytics.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!analytics) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Analytics not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Revenue analytics updated successfully",
      data: analytics,
    });
  }),

  // ✅ DELETE ANALYTICS
  deleteAnalytics: asyncHandler(async (req: Request, res: Response) => {
    const analytics = await RevenueAnalytics.findByIdAndDelete(req.params.id);

    if (!analytics) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Analytics not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Revenue analytics deleted successfully",
    });
  }),
};
