"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRevenueController = void 0;
const RevenueReport_1 = __importDefault(require("../../models/RevenueReport"));
const errorHandler_1 = require("../../middlewares/errorHandler");
exports.ClientRevenueController = {
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const data = await RevenueReport_1.default.find({ userId }).sort({ date: -1 });
        const totalIn = data
            .filter((t) => t.type === "in")
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalPaidWithdraw = data
            .filter((t) => t.type === "withdraw" && t.status === "Paid")
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const availableBalance = totalIn - totalPaidWithdraw;
        return res.json({
            success: true,
            balance: availableBalance,
            withdrawable: availableBalance,
            data, // all transactions (Pending, Failed, Paid, Income)
        });
    }),
    withdraw: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { amount } = req.body;
        if (!amount || amount < 1000) {
            return res.status(400).json({
                success: false,
                message: "Minimum withdrawal amount is ₹1000",
            });
        }
        await RevenueReport_1.default.create({
            userId,
            source: "Money Withdraw",
            type: "withdraw",
            amount,
            date: new Date(),
            period: "",
            status: "Pending",
        });
        return res.json({
            success: true,
            message: "Withdrawal request submitted",
        });
    }),
};
