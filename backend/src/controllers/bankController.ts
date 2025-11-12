import { Request, Response } from "express";
import BankDetails from "../models/BankDetails";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const bankController = {
  // ✅ Get all user bank details
  list: asyncHandler(async (_req: Request, res: Response) => {
    const all = await BankDetails.find().populate("userId", "firstName lastName email");
    res.status(HTTP_STATUS.OK).json({ success: true, data: all });
  }),

  // ✅ Get single user’s details
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const detail = await BankDetails.findById(id).populate("userId", "firstName lastName email");
    if (!detail)
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: "Record not found" });

    res.status(HTTP_STATUS.OK).json({ success: true, data: detail });
  }),

  // ✅ Verify / Unverify
  verify: asyncHandler(async (req: Request, res: Response) => {
    const { verified } = req.body;
    const detail = await BankDetails.findByIdAndUpdate(req.params.id, { verified }, { new: true });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: detail,
      message: "Verification status updated",
    });
  }),

  // ✅ Delete record
  delete: asyncHandler(async (req: Request, res: Response) => {
    await BankDetails.findByIdAndDelete(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, message: "Bank details deleted" });
  }),
};
