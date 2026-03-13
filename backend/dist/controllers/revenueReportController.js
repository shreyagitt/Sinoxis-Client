"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRevenueController = void 0;
const RevenueReport_1 = __importDefault(require("../models/RevenueReport"));
const errorHandler_1 = require("../middlewares/errorHandler");
exports.AdminRevenueController = {
    // ======================= LIST ALL REVENUES =======================
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await RevenueReport_1.default.find()
            .populate("userId", "fullName email")
            .sort({ date: -1 });
        return res.json({ success: true, data });
    }),
    // ======================= UPDATE WITHDRAWAL STATUS =======================
    updateWithdrawStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        const allowedStatuses = ["Paid", "Failed"];
        // Validate status
        if (!status || !allowedStatuses.includes(status)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid status" });
        }
        const id = req.params.id;
        // Validate record exists
        const rev = await RevenueReport_1.default.findById(id);
        if (!rev) {
            return res
                .status(404)
                .json({ success: false, message: "Revenue record not found" });
        }
        // Ensure only withdrawal entries are updated
        if (rev.type !== "withdraw") {
            return res
                .status(400)
                .json({ success: false, message: "This entry is not a withdrawal" });
        }
        // FIX: Cast status correctly
        rev.status = status;
        await rev.save();
        return res.json({
            success: true,
            message: "Withdrawal status updated",
            data: rev,
        });
    }),
    // ======================= DELETE TRANSACTION =======================
    deleteTransaction: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const rev = await RevenueReport_1.default.findById(id);
        if (!rev) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }
        await RevenueReport_1.default.findByIdAndDelete(id);
        return res.json({
            success: true,
            message: "Transaction deleted successfully",
        });
    }),
};
