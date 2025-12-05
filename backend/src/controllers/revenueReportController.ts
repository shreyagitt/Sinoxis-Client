import { Request, Response } from "express";
import RevenueRecord, { RevenueRecordDocument } from "../models/RevenueRecord";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const RevenueAdminController = {

  getSummary: asyncHandler(async (_req: Request, res: Response) => {
    const records: RevenueRecordDocument[] = await RevenueRecord.find().sort({
      createdAt: -1,
    });

    const income = records.filter(r => r.type === "income");
    const withdrawals = records.filter(r => r.type === "withdraw");

    const totalIncome = income.reduce((s, x) => s + x.amount, 0);

    const approvedWithdraw = withdrawals
      .filter(x => x.status === "Approved")
      .reduce((s, x) => s + x.amount, 0);

    res.json({
      success: true,
      data: {
        balance: totalIncome,
        withdrawable: totalIncome - approvedWithdraw,
        transactions: records,
      },
    });
  }),

 addIncome: asyncHandler(async (req: Request, res: Response) => {
  const { userId, amount, source, period } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "userId is required to assign income"
    });
  }

  const record = await RevenueRecord.create({
    userId,
    type: "income",
    amount,
    source,
    period,
    status: "Paid",
  });

  res.json({ success: true, data: record });
}),


  listWithdraws: asyncHandler(async (_req: Request, res: Response) => {
    const list = await RevenueRecord.find({ type: "withdraw" }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: list });
  }),

  updateWithdrawStatus: asyncHandler(async (req: Request, res: Response) => {
    const updated = await RevenueRecord.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ success: true, data: updated });
  }),

  deleteTransaction: asyncHandler(async (req: Request, res: Response) => {
    const deleted = await RevenueRecord.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Transaction not found",
      });
    }

    res.json({ success: true, message: "Deleted" });
  }),
};
