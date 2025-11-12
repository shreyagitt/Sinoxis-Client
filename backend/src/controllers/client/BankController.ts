import { Request, Response } from "express";
import BankDetails from "../../models/BankDetails";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const BankController = {
  // ✅ Create or Update (Upsert)
  upsert: asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized user",
      });
    }

    const data = req.body;

    const bankDetails = await BankDetails.findOneAndUpdate(
      { userId },
      { ...data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: bankDetails,
      message: "Bank details saved successfully",
    });
  }),

  // ✅ Get logged-in user’s bank details
  getMyDetails: asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?.userId;
    const bankDetails = await BankDetails.findOne({ userId });

    if (!bankDetails) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "No bank details found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: bankDetails,
    });
  }),
};
