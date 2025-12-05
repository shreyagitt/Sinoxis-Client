import { Request, Response } from "express";
import RevenueRecord from "../../models/RevenueRecord";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientRevenueController = {
  
  // ------------------------------  
  // GET /client/revenue  
  // ------------------------------  
  getRevenue: asyncHandler(async (req: any, res: Response) => {
    const userId = req.user.userId;

    const records = await RevenueRecord.find({ userId }).sort({ createdAt: -1 });

    // Balance = all income - approved withdrawals
    const balance = records.reduce((sum:any, r:any) => sum + r.amount, 0);

    const pendingWithdraw = records
      .filter((r:any) => r.type === "withdraw" && r.status === "Pending")
      .reduce((sum:any, r:any) => sum + Math.abs(r.amount), 0); // positive

    const withdrawable = balance - pendingWithdraw;

    const transactions = records.map((r:any) => ({
      source: r.type === "income" ? r.source : "Money Withdraw",
      date: new Date(r.createdAt).toLocaleDateString(),
      amount:
        (r.amount >= 0 ? "+" : "-") + Math.abs(r.amount) + " ₹",
      period: r.period || "—",
      status: r.status,
    }));

    res.json({
      success: true,
      data: { balance, withdrawable, transactions },
    });
  }),

  // ------------------------------  
  // POST /client/withdraw-request  
  // ------------------------------  
  withdrawRequest: asyncHandler(async (req: any, res: Response) => {
    const userId = req.user.userId;
    const { amount } = req.body;

    if (!amount || amount < 1000) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    await RevenueRecord.create({
      userId,
      type: "withdraw",
      amount: -amount, // negative entry
      status: "Pending",
    });

    res.json({ success: true, message: "Withdraw request submitted!" });
  }),
};

