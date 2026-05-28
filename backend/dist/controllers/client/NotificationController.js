"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.deleteNotification = exports.getMyNotifications = void 0;
const Notification_1 = __importDefault(require("../../models/Notification"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
// ✅ GET MY NOTIFICATIONS
exports.getMyNotifications = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId; // ✅ safe access
    const notifications = await Notification_1.default.find({
        roleTarget: "client", // ✅ ensure client-only notifications
        $or: [
            { userId: userId }, // ✅ personal notifications
            { userId: null }, // ✅ global admin notifications
        ],
    })
        .sort({ createdAt: -1 })
        .limit(30);
    res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        data: notifications,
    });
});
// ✅ DELETE ONE NOTIFICATION
exports.deleteNotification = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await Notification_1.default.findByIdAndDelete(id);
    res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        message: "Notification removed",
    });
});
// ✅ MARK ALL AS READ
exports.markAllAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    await Notification_1.default.updateMany({
        roleTarget: "client",
        isRead: false,
        $or: [
            { userId: userId },
            { userId: null },
        ],
    }, { isRead: true });
    res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        message: "All notifications marked as read",
    });
});
