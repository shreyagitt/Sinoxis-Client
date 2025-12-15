import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import FacebookVideo from "../models/FacebookVideo";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const facebookVideoController = {
  /**
   * 🧾 View all Facebook video claims
   * GET /api/v1/facebook-videos
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const videos = await FacebookVideo.find().sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: videos,
    });
  }),

  /**
   * 🧩 Update claim status (e.g., Reviewed, Resolved)
   * PATCH /api/v1/facebook-videos/:id/status
   */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!["Pending", "Reviewed", "Resolved", "Rejected"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const updated = await FacebookVideo.findByIdAndUpdate(
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
      message: "Status updated successfully.",
      data: updated,
    });
  }),

  /**
   * ❌ Delete submission (and remove screenshot from Cloudinary)
   * DELETE /api/v1/facebook-videos/:id
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const video = await FacebookVideo.findById(req.params.id);

    if (!video) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Submission not found",
      });
    }

    // Delete from Cloudinary if exists
    if (video.screenshotFbId) {
      await cloudinary.uploader.destroy(video.screenshotFbId);
    }

    await video.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Submission deleted successfully.",
    });
  }),
};
