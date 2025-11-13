import { Request, Response } from "express";
import Notification from "../models/Notification";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminNotificationController = {
  /**
   * 🧾 Create Notification
   * POST /api/v1/notifications
   */
  create: asyncHandler(async (req: Request, res: Response) => {
    const { userId, title, desc, time } = req.body;

    if (!title || !desc || !time) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Title, description, and time are required.",
      });
    }

    const notification = await Notification.create({
      userId: userId || null, // if null → broadcast to all
      title,
      desc,
      time,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Notification created successfully.",
      data: notification,
    });
  }),

  /**
   * 📋 View All Notifications (for dashboard)
   * GET /api/v1/notifications
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data: notifications });
  }),

  /**
   * ❌ Delete Notification
   * DELETE /api/v1/notifications/:id
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Notification not found.",
      });
    }
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  }),
};
