import { Request, Response } from "express";
import YouTubeClaim from "../models/YouTubeClaim";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminYouTubeClaimController = {
  /**
   * 🧾 Get all YouTube Claims
   * GET /api/v1/youtube-claims
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await YouTubeClaim.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  }),

  /**
   * 🧩 Update Claim Status
   * PATCH /api/v1/youtube-claims/:id/status
   */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!["Pending", "Reviewed", "Approved", "Rejected"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const updated = await YouTubeClaim.findByIdAndUpdate(
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

  /**
   * ❌ Delete Claim
   * DELETE /api/v1/youtube-claims/:id
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const record = await YouTubeClaim.findById(req.params.id);

    if (!record) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Claim not found",
      });
    }

    if (record.screenshotId) {
      await cloudinary.uploader.destroy(record.screenshotId);
    }

    await record.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Claim deleted successfully",
    });
  }),
};
