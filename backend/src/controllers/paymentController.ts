import { Request, Response } from "express";
import PaymentRequest from "../models/PaymentRequest";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminPaymentController = {
  /**
   * 🧾 Get All Payment Requests
   * GET /api/v1/payments
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const requests = await PaymentRequest.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data: requests });
  }),

  /**
   * 🔄 Update Payment Status
   * PATCH /api/v1/payments/:id/status
   */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!["Pending", "Processing", "Completed", "Rejected"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const updated = await PaymentRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Payment request not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Payment status updated successfully",
      data: updated,
    });
  }),

  /**
   * ❌ Delete a Payment Request
   * DELETE /api/v1/payments/:id
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const deleted = await PaymentRequest.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Payment request not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Payment request deleted successfully",
    });
  }),
};
