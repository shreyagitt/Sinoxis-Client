import { Request, Response } from "express";
import Revenue from "../../models/RevenueReport";
import { asyncHandler } from "../../middlewares/errorHandler";

export const ClientRevenueController = {

list: asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const data = await Revenue.find({ userId }).sort({ date: -1 });

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
})
,

  withdraw: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { amount } = req.body as { amount?: number };

    if (!amount || amount < 1000) {
      return res.status(400).json({
        success: false,
        message: "Minimum withdrawal amount is ₹1000",
      });
    }

    await Revenue.create({
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

