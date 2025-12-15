import { Request, Response } from "express";
import PaymentRequest from "../../models/PaymentRequest";
import { User } from "../../models/User";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientPaymentController = {

  /* ✅ CREATE REQUEST */
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { amount, method, notes, bankData, paypalData } = req.body;


    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "User not found",
      });
    }

    if (amount > user.balance) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Insufficient balance",
      });
    }

    const processingFee = amount > 5000 ? amount * 0.015 : 0;
    const totalReceive = amount - processingFee;

    const request = await PaymentRequest.create({
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

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: request,
    });
  }),

  /* ✅ LIST MY REQUESTS */
  listMyRequests: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const requests = await PaymentRequest.find({ userId }).sort({
      createdAt: -1,
    });

    const user = await User.findById(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      balance: user?.balance ?? 0,
      data: requests,
    });
  }),
};

