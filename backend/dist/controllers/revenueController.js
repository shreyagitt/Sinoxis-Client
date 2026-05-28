"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRevenueController = void 0;
const RevenueAnalytics_1 = __importDefault(require("../models/RevenueAnalytics"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminRevenueController = {
    // ✅ CREATE ANALYTICS (ADMIN ONLY)
    createAnalytics: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const analytics = await RevenueAnalytics_1.default.create(req.body);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Revenue analytics created successfully",
            data: analytics,
        });
    }),
    // ✅ GET ALL ANALYTICS
    getAllAnalytics: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const analytics = await RevenueAnalytics_1.default.find().populate("userId", "fullName email");
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            count: analytics.length,
            data: analytics,
        });
    }),
    // ✅ GET SINGLE ANALYTICS BY ID
    getSingleAnalytics: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const analytics = await RevenueAnalytics_1.default.findById(req.params.id).populate("userId", "fullName email");
        if (!analytics) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Analytics not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: analytics,
        });
    }),
    // ✅ UPDATE ANALYTICS
    updateAnalytics: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const analytics = await RevenueAnalytics_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!analytics) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Analytics not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Revenue analytics updated successfully",
            data: analytics,
        });
    }),
    // ✅ DELETE ANALYTICS
    deleteAnalytics: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const analytics = await RevenueAnalytics_1.default.findByIdAndDelete(req.params.id);
        if (!analytics) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Analytics not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Revenue analytics deleted successfully",
        });
    }),
};
