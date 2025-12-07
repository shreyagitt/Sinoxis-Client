import { Request, Response } from "express";
import PaymentRequest from "../models/PaymentRequest";
import { User } from "../models/User";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminPaymentController = {

  /* ✅ LIST ALL */
  listAll: asyncHandler(async (_: Request, res: Response) => {
    const data = await PaymentRequest.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }),

  /* ✅ UPDATE STATUS */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const id = req.params.id;

    const request = await PaymentRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const user = await User.findById(request.userId);

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
  deleteRequest: asyncHandler(async (req: Request, res: Response) => {
    const request = await PaymentRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const user = await User.findById(request.userId);

    // ✅ REFUND IF STILL PENDING
    if (request.status === "Pending" && user) {
      user.balance += request.amount;
      await user.save();
    }

    await request.deleteOne();

    res.json({ message: "Deleted successfully" });
  }),
};
