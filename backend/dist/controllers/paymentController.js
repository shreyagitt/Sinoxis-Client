"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPaymentController = void 0;
const PaymentRequest_1 = __importDefault(require("../models/PaymentRequest"));
const User_1 = require("../models/User");
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminPaymentController = {
    /* ✅ LIST ALL */
    listAll: (0, errorHandler_1.asyncHandler)(async (_, res) => {
        const data = await PaymentRequest_1.default.find()
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data,
        });
    }),
    /* ✅ UPDATE STATUS */
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        const id = req.params.id;
        const request = await PaymentRequest_1.default.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        const user = await User_1.User.findById(request.userId);
        // ✅ REFUND IF FAILED
        if (status === "Failed" && user) {
            user.balance += request.amount;
            await user.save();
        }
        request.status = status;
        await request.save();
        res.status(200).json({
            message: "Status updated",
        });
    }),
    /* ✅ DELETE */
    deleteRequest: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const request = await PaymentRequest_1.default.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        const user = await User_1.User.findById(request.userId);
        // ✅ REFUND IF STILL PENDING
        if (request.status === "Pending" && user) {
            user.balance += request.amount;
            await user.save();
        }
        await request.deleteOne();
        res.json({ message: "Deleted successfully" });
    }),
};
