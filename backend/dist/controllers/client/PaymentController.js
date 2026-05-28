"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPaymentController = void 0;
const PaymentRequest_1 = __importDefault(require("../../models/PaymentRequest"));
const User_1 = require("../../models/User");
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientPaymentController = {
    /* ✅ CREATE REQUEST */
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.userId;
        const { amount, method, notes, bankData, paypalData } = req.body;
        if (!userId) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: "Unauthorized",
            });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: "User not found",
            });
        }
        if (amount > user.balance) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: "Insufficient balance",
            });
        }
        const processingFee = amount > 5000 ? amount * 0.015 : 0;
        const totalReceive = amount - processingFee;
        const request = await PaymentRequest_1.default.create({
            userId,
            amount,
            method,
            notes,
            processingFee,
            totalReceive,
            paymentDetails: {
                bank: method === "bank" ? bankData : undefined,
                paypal: method === "paypal" ? paypalData : undefined,
            },
        });
        // ✅ ATOMIC BALANCE DEDUCTION
        user.balance -= amount;
        await user.save();
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            data: request,
        });
    }),
    /* ✅ LIST MY REQUESTS */
    listMyRequests: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.userId;
        const requests = await PaymentRequest_1.default.find({ userId }).sort({
            createdAt: -1,
        });
        const user = await User_1.User.findById(userId);
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            balance: user?.balance ?? 0,
            data: requests,
        });
    }),
};
