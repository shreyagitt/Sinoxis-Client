"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminYouTubeClaimController = void 0;
const YouTubeClaim_1 = __importDefault(require("../models/YouTubeClaim"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminYouTubeClaimController = {
    /**
     * 🧾 Get all YouTube Claims
     * GET /api/v1/youtube-claims
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await YouTubeClaim_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, data });
    }),
    /**
     * 🧩 Update Claim Status
     * PATCH /api/v1/youtube-claims/:id/status
     */
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        if (!["Pending", "Reviewed", "Approved", "Rejected"].includes(status)) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: "Invalid status value",
            });
        }
        const updated = await YouTubeClaim_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Claim not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Status updated successfully",
            data: updated,
        });
    }),
    /**
     * ❌ Delete Claim
     * DELETE /api/v1/youtube-claims/:id
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const record = await YouTubeClaim_1.default.findById(req.params.id);
        if (!record) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Claim not found",
            });
        }
        if (record.screenshotId) {
            await cloudinary_1.default.uploader.destroy(record.screenshotId);
        }
        await record.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Claim deleted successfully",
        });
    }),
};
