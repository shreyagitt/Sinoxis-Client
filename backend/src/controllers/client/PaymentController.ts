import { Request, Response } from "express";
import PaymentRequest from "../../models/PaymentRequest";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

const MAX_BALANCE = 89452;

export const ClientPaymentController = {
  /**
   * 💸 Submit New Payment Request
   * POST /api/v1/client/payments
   */
  create: asyncHandler(async (req: Request, res: Response) => {
    const { amount, method, notes } = req.body;
    const userId = (req as any).user?.userId || "guest";

    if (amount > MAX_BALANCE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Amount exceeds available balance.",
      });
    }

    const processingFee = amount > 5000 ? amount * 0.015 : 0;
    const tax = 0;
    const totalReceive = amount - processingFee - tax;
    const deliveryTime = method === "bank" ? "3-5 business days" : "1-2 business days";

    const payment = await PaymentRequest.create({
      userId,
      amount,
      method,
      notes,
      processingFee,
      tax,
      totalReceive,
      deliveryTime,
      status: "Pending",
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Payment request submitted successfully.",
      data: payment,
    });
  }),

  /**
   * 📋 View All User Payment Requests
   * GET /api/v1/client/payments
   */
  list: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId || "guest";
    const payments = await PaymentRequest.find({ userId }).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: payments,
    });
  }),
};
