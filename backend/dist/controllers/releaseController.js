"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReleaseByAdmin = exports.updateReleaseStatus = exports.getAllReleases = void 0;
const Release_1 = __importDefault(require("../models/Release"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const errorHandler_1 = require("../middlewares/errorHandler");
/* =====================================================
   GET ALL RELEASES (ADMIN)
   ===================================================== */
exports.getAllReleases = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const data = await Release_1.default.find()
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 });
    res.json({ success: true, data });
});
/* =====================================================
   UPDATE RELEASE STATUS (ADMIN)
   ===================================================== */
exports.updateReleaseStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = [
        "Pending",
        "Approved",
        "Rejected",
        "Inactive",
        "Unfinished",
        "Action Required",
    ];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value",
        });
    }
    const release = await Release_1.default.findById(req.params.id);
    if (!release) {
        return res.status(404).json({
            success: false,
            message: "Release not found",
        });
    }
    release.status = status;
    await release.save();
    res.json({ success: true, data: release });
});
/* =====================================================
   DELETE RELEASE (ADMIN – HARD DELETE)
   ===================================================== */
exports.deleteReleaseByAdmin = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const release = await Release_1.default.findById(req.params.id);
    if (!release) {
        return res.status(404).json({
            success: false,
            message: "Release not found",
        });
    }
    /* ===== DELETE COVER FROM CLOUDINARY (SAFE) ===== */
    if (release.coverImageId) {
        try {
            await cloudinary_1.default.uploader.destroy(release.coverImageId);
        }
        catch (err) {
            console.error("Cloudinary delete failed:", release.coverImageId, err);
            // DO NOT throw — continue deletion
        }
    }
    await release.deleteOne();
    res.json({
        success: true,
        message: "Release deleted permanently by admin",
    });
});
