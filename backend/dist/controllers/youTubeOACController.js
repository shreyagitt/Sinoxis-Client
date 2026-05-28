"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminYouTubeOACController = void 0;
const YouTubeOAC_1 = __importDefault(require("../models/YouTubeOAC"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminYouTubeOACController = {
    /**
     * 🧾 Get all OAC Requests
     * GET /api/v1/youtube-oac
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await YouTubeOAC_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, data });
    }),
    /**
     * 🧩 Update Request Status
     * PATCH /api/v1/youtube-oac/:id/status
     */
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        if (!["Pending", "Under Review", "Approved", "Rejected"].includes(status)) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: "Invalid status value",
            });
        }
        const updated = await YouTubeOAC_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Request not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Request status updated successfully",
            data: updated,
        });
    }),
    /**
     * ❌ Delete Request
     * DELETE /api/v1/youtube-oac/:id
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const record = await YouTubeOAC_1.default.findById(req.params.id);
        if (!record) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Request not found",
            });
        }
        await record.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "YouTube OAC request deleted successfully.",
        });
    }),
};
