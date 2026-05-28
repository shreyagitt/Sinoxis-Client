"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.getAllNotifications = exports.sendNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
// ✅ SEND NOTIFICATION TO CLIENT
exports.sendNotification = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId, title, desc } = req.body;
    const data = {
        title,
        desc,
        roleTarget: "client",
    };
    // ✅ ONLY ADD userId IF IT EXISTS
    if (userId && userId.trim() !== "") {
        data.userId = userId;
    }
    const notification = await Notification_1.default.create(data);
    res.status(constants_1.HTTP_STATUS.CREATED).json({
        success: true,
        message: "Notification sent",
        data: notification,
    });
});
// ✅ GET ALL NOTIFICATIONS (ADMIN)
exports.getAllNotifications = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const notifications = await Notification_1.default.find()
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 });
    res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        data: notifications,
    });
});
// ✅ DELETE ONE NOTIFICATION (ADMIN)
exports.deleteNotification = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const deleted = await Notification_1.default.findByIdAndDelete(id);
    if (!deleted) {
        return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: "Notification not found",
        });
    }
    res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        message: "Notification deleted successfully",
    });
});
