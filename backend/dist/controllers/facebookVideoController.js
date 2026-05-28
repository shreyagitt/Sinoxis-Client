"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookVideoController = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const FacebookVideo_1 = __importDefault(require("../models/FacebookVideo"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.facebookVideoController = {
    /**
     * 🧾 View all Facebook video claims
     * GET /api/v1/facebook-videos
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const videos = await FacebookVideo_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: videos,
        });
    }),
    /**
     * 🧩 Update claim status (e.g., Reviewed, Resolved)
     * PATCH /api/v1/facebook-videos/:id/status
     */
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        if (!["Pending", "Reviewed", "Resolved", "Rejected"].includes(status)) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: "Invalid status value",
            });
        }
        const updated = await FacebookVideo_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Submission not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Status updated successfully.",
            data: updated,
        });
    }),
    /**
     * ❌ Delete submission (and remove screenshot from Cloudinary)
     * DELETE /api/v1/facebook-videos/:id
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const video = await FacebookVideo_1.default.findById(req.params.id);
        if (!video) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Submission not found",
            });
        }
        // Delete from Cloudinary if exists
        if (video.screenshotFbId) {
            await cloudinary_1.default.uploader.destroy(video.screenshotFbId);
        }
        await video.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Submission deleted successfully.",
        });
    }),
};
