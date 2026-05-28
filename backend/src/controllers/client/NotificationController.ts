import { Request, Response } from "express";
import Notification from "../../models/Notification";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

// ✅ GET MY NOTIFICATIONS
export const getMyNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId; // ✅ safe access

    const notifications = await Notification.find({
      roleTarget: "client", // ✅ ensure client-only notifications
      $or: [
        { userId: userId },  // ✅ personal notifications
        { userId: null },    // ✅ global admin notifications
      ],
    })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: notifications,
    });
  }
);


// ✅ DELETE ONE NOTIFICATION
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Notification removed",
    });
  }
);

// ✅ MARK ALL AS READ
export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    await Notification.updateMany(
  {
    roleTarget: "client",
    isRead: false,
    $or: [
      { userId: userId },
      { userId: null },
    ],
  },
  { isRead: true }
);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "All notifications marked as read",
    });
  }
);
