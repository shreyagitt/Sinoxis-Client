"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCopyrightClaimController = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
const CopyrightClaim_1 = __importDefault(require("../models/CopyrightClaim"));
exports.AdminCopyrightClaimController = {
    // ⭐ ADMIN — List all copyright claims
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const claims = await CopyrightClaim_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: claims,
        });
    }),
    // ⭐ ADMIN — Update status (Pending → Released/Rejected)
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        if (!["Pending", "Rejected", "Released"].includes(status)) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: "Invalid status value",
            });
        }
        const updated = await CopyrightClaim_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
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
    // ⭐ ADMIN — Delete a claim
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const deleted = await CopyrightClaim_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Claim not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Claim deleted successfully",
        });
    }),
};
