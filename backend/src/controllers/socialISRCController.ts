import { Request, Response } from "express";
import SocialISRC from "../models/SocialISRC";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminSocialISRCController = {
  /**
   * 🧾 Get all ISRC submissions
   * GET /api/v1/social-isrc
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await SocialISRC.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  }),

  /**
   * 🧩 Update submission status
   * PATCH /api/v1/social-isrc/:id/status
   */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!["Pending", "Reviewed", "Approved", "Rejected"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const updated = await SocialISRC.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Submission not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    });
  }),

  /**
   * ❌ Delete submission
   * DELETE /api/v1/social-isrc/:id
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const record = await SocialISRC.findById(req.params.id);

    if (!record) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Submission not found",
      });
    }

    await record.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Submission deleted successfully",
    });
  }),
};
