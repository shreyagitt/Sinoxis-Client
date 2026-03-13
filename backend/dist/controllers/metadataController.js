"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataController = void 0;
const Metadata_1 = __importDefault(require("../models/Metadata"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.metadataController = {
    /**
     * 🧾 List all submissions
     * GET /api/v1/metadata
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await Metadata_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, data });
    }),
    /**
     * 🧩 Update Metadata Status
     * PATCH /api/v1/metadata/:id/status
     */
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        if (!["Pending", "Reviewed", "Approved", "Rejected"].includes(status)) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: "Invalid status value",
            });
        }
        const updated = await Metadata_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Metadata entry not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Status updated successfully",
            data: updated,
        });
    }),
    /**
     * ❌ Delete Metadata (and remove artwork from Cloudinary)
     * DELETE /api/v1/metadata/:id
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const record = await Metadata_1.default.findById(req.params.id);
        if (!record) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Metadata entry not found",
            });
        }
        if (record.artworkId) {
            await cloudinary_1.default.uploader.destroy(record.artworkId);
        }
        await record.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Metadata entry deleted successfully",
        });
    }),
};
