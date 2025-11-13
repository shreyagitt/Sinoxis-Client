import { Request, Response } from "express";
import Notification from "../../models/Notification";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientNotificationController = {
  /**
   * 📥 Get User Notifications
   * GET /api/v1/client/notifications
   */
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || "guest";

    const notifications = await Notification.find({
      $or: [{ userId }, { userId: null }], // include global notifications
    }).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: notifications,
    });
  }),

  /**
   * ✅ Mark All Notifications as Read
   * PATCH /api/v1/client/notifications/mark-all
   */
  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || "guest";

    await Notification.updateMany(
      { $or: [{ userId }, { userId: null }] },
      { $set: { isRead: true } }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "All notifications marked as read.",
    });
  }),

  /**
   * ❌ Remove Notification by ID
   * DELETE /api/v1/client/notifications/:id
   */
  deleteOne: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || "guest";

    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      $or: [{ userId }, { userId: null }],
    });

    if (!deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Notification not found or unauthorized.",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Notification removed successfully.",
    });
  }),
};
