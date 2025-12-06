import { Request, Response } from "express";
import Revenue from "../models/RevenueReport";
import { asyncHandler } from "../middlewares/errorHandler";

// Correct TypeScript union type
type WithdrawStatus = "Pending" | "Paid" | "Failed";

export const AdminRevenueController = {

  // ======================= LIST ALL REVENUES =======================
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await Revenue.find()
      .populate("userId", "fullName email")
      .sort({ date: -1 });

    return res.json({ success: true, data });
  }),

  // ======================= UPDATE WITHDRAWAL STATUS =======================
  updateWithdrawStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body as { status?: string };

    const allowedStatuses: WithdrawStatus[] = ["Paid", "Failed"];

    // Validate status
    if (!status || !allowedStatuses.includes(status as WithdrawStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const id = req.params.id;

    // Validate record exists
    const rev = await Revenue.findById(id);
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
    rev.status = status as WithdrawStatus;

    await rev.save();

    return res.json({
      success: true,
      message: "Withdrawal status updated",
      data: rev,
    });
  }),
  // ======================= DELETE TRANSACTION =======================
deleteTransaction: asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const rev = await Revenue.findById(id);
  if (!rev) {
    return res.status(404).json({ success: false, message: "Transaction not found" });
  }

  await Revenue.findByIdAndDelete(id);

  return res.json({
    success: true,
    message: "Transaction deleted successfully",
  });
}),

};

