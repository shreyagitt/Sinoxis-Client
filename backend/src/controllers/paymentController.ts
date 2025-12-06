import PaymentRequest from "../models/PaymentRequest.js";
import User from "../models/User.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { HTTP_STATUS } from "../config/constants.js";

export const AdminPaymentController = {

  /* ----------------------------------------
     LIST ALL REQUESTS
  ---------------------------------------- */
  list: asyncHandler(async (req, res) => {
    const data = await PaymentRequest.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }),

  /* ----------------------------------------
     UPDATE STATUS
  ---------------------------------------- */
  updateStatus: asyncHandler(async (req, res) => {
    const { status } = req.body;
    const id = req.params.id;

    const allowed = ["Paid", "Failed"];
    if (!allowed.includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request = await PaymentRequest.findById(id);
    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Request not found",
      });
    }

    const user = await User.findById(request.userId);

    // Refund user balance if failed
    if (status === "Failed") {
      user.balance += request.amount;
      await user.save();
    }

    request.status = status;
    await request.save();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Status updated",
      data: request,
    });
  }),

  /* ----------------------------------------
     DELETE REQUEST
  ---------------------------------------- */
  delete: asyncHandler(async (req, res) => {
    const id = req.params.id;

    const reqDoc = await PaymentRequest.findById(id);
    if (!reqDoc) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Request not found",
      });
    }

    const user = await User.findById(reqDoc.userId);

    // Refund if Pending
    if (reqDoc.status === "Pending") {
      user.balance += reqDoc.amount;
      await user.save();
    }

    await reqDoc.deleteOne();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Request deleted",
    });
  }),
};
