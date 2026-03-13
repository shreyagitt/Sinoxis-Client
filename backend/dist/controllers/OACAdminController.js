"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOACController = void 0;
const OACRequest_1 = __importDefault(require("../models/OACRequest"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminOACController = {
    // --------------------------------------------------
    // ADMIN — LIST ALL OAC REQUESTS
    // --------------------------------------------------
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        const requests = await OACRequest_1.default.find(filter)
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: requests,
        });
    }),
    // --------------------------------------------------
    // ADMIN — UPDATE STATUS
    // --------------------------------------------------
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        if (!["Approved", "Rejected", "Released"].includes(status)) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Invalid status",
            });
        }
        const updated = await OACRequest_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Request not found",
            });
        }
        res.json({
            success: true,
            data: updated,
            message: `Status updated to ${status}`,
        });
    }),
};
