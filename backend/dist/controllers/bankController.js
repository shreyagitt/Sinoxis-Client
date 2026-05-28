"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankController = void 0;
const BankDetails_1 = __importDefault(require("../models/BankDetails"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.bankController = {
    // ✅ Get all user bank details
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const all = await BankDetails_1.default.find().populate("userId", "firstName lastName email");
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, data: all });
    }),
    // ✅ Get single user’s details
    getOne: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const detail = await BankDetails_1.default.findById(id).populate("userId", "firstName lastName email");
        if (!detail)
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({ success: false, error: "Record not found" });
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, data: detail });
    }),
    // ✅ Verify / Unverify
    verify: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { verified } = req.body;
        const detail = await BankDetails_1.default.findByIdAndUpdate(req.params.id, { verified }, { new: true });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: detail,
            message: "Verification status updated",
        });
    }),
    // ✅ Delete record
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        await BankDetails_1.default.findByIdAndDelete(req.params.id);
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, message: "Bank details deleted" });
    }),
};
