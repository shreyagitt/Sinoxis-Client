"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSocialISRCController = void 0;
const SocialISRC_1 = __importDefault(require("../models/SocialISRC"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminSocialISRCController = {
    /**
     * 🧾 Get all ISRC submissions
     * GET /api/v1/social-isrc
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await SocialISRC_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, data });
    }),
    /**
     * 🧩 Update submission status
     * PATCH /api/v1/social-isrc/:id/status
     */
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        if (!["Pending", "Reviewed", "Approved", "Rejected"].includes(status)) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: "Invalid status value",
            });
        }
        const updated = await SocialISRC_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Submission not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Status updated successfully",
            data: updated,
        });
    }),
    /**
     * ❌ Delete submission
     * DELETE /api/v1/social-isrc/:id
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const record = await SocialISRC_1.default.findById(req.params.id);
        if (!record) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Submission not found",
            });
        }
        await record.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Submission deleted successfully",
        });
    }),
};
