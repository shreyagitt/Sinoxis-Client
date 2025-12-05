import { Request, Response } from "express";
import OACRequest from "../models/OACRequest";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminOACController = {
  // --------------------------------------------------
  // ADMIN — LIST ALL OAC REQUESTS
  // --------------------------------------------------
  list: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;

    const filter: any = {};
    if (status) filter.status = status;

    const requests = await OACRequest.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: requests,
    });
  }),

  // --------------------------------------------------
  // ADMIN — UPDATE STATUS
  // --------------------------------------------------
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!["Approved", "Rejected", "Released"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updated = await OACRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Request not found",
      });
    }

    res.json({
      success: true,
      data: updated,
      message: `Status updated to ${status}`,
    });
  }),
};
