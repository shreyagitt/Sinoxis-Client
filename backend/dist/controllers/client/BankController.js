"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankController = void 0;
const BankDetails_1 = __importDefault(require("../../models/BankDetails"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.BankController = {
    // ✅ Create or Update (Upsert)
    upsert: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: "Unauthorized user",
            });
        }
        const data = req.body;
        const bankDetails = await BankDetails_1.default.findOneAndUpdate({ userId }, { ...data }, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: bankDetails,
            message: "Bank details saved successfully",
        });
    }),
    // ✅ Get logged-in user’s bank details
    getMyDetails: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.userId;
        const bankDetails = await BankDetails_1.default.findOne({ userId });
        if (!bankDetails) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "No bank details found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: bankDetails,
        });
    }),
};
