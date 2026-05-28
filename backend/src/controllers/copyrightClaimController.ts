import { Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { AuthenticatedRequest } from "../middlewares/auth";
import { HTTP_STATUS } from "../config/constants";
import CopyrightClaim from "../models/CopyrightClaim";

export const AdminCopyrightClaimController = {

  // ⭐ ADMIN — List all copyright claims
  list: asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
    const claims = await CopyrightClaim.find().sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: claims,
    });
  }),

  // ⭐ ADMIN — Update status (Pending → Released/Rejected)
  updateStatus: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;

    if (!["Pending", "Rejected", "Released"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const updated = await CopyrightClaim.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Claim not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    });
  }),

  // ⭐ ADMIN — Delete a claim
  delete: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const deleted = await CopyrightClaim.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Claim not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Claim deleted successfully",
    });
  }),
};
