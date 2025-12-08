import { Request, Response } from "express";
import Notification from "../models/Notification";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

// ✅ SEND NOTIFICATION TO CLIENT
export const sendNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, title, desc } = req.body;

    const data: any = {
      title,
      desc,
      roleTarget: "client",
    };

    // ✅ ONLY ADD userId IF IT EXISTS
    if (userId && userId.trim() !== "") {
      data.userId = userId;
    }

    const notification = await Notification.create(data);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Notification sent",
      data: notification,
    });
  }
);



// ✅ GET ALL NOTIFICATIONS (ADMIN)
export const getAllNotifications = asyncHandler(
  async (_req: Request, res: Response) => {
    const notifications = await Notification.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: notifications,
    });
  }
);

// ✅ DELETE ONE NOTIFICATION (ADMIN)
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Notification deleted successfully",
    });
  }
);
