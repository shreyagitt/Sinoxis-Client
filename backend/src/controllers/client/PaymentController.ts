import PaymentRequest from "../../models/PaymentRequest.js";
import User from "../../models/User";
import { asyncHandler } from "../../middlewares/errorHandler.js";
import { HTTP_STATUS } from "../../config/constants.js";

export const ClientPaymentController = {

  /* ----------------------------------------
     CREATE PAYMENT REQUEST
  ---------------------------------------- */
  create: asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { amount, method, notes } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    if (amount > user.balance) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
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
        bank: user.bankDetails,
        paypal: user.paypalDetails,
      },
    });

    // Deduct immediately
    user.balance -= amount;
    await user.save();

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Payment request submitted",
      data: request,
    });
  }),

  /* ----------------------------------------
     LIST USER REQUESTS
  ---------------------------------------- */
  list: asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const requests = await PaymentRequest.find({ userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      balance: user.balance,
      data: requests,
    });
  }),
};
