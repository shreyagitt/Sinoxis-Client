import { Request, Response } from "express";
import YouTubeOAC from "../models/YouTubeOAC";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminYouTubeOACController = {
  /**
   * 🧾 Get all OAC Requests
   * GET /api/v1/youtube-oac
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await YouTubeOAC.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  }),

  /**
   * 🧩 Update Request Status
   * PATCH /api/v1/youtube-oac/:id/status
   */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!["Pending", "Under Review", "Approved", "Rejected"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const updated = await YouTubeOAC.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Request not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Request status updated successfully",
      data: updated,
    });
  }),

  /**
   * ❌ Delete Request
   * DELETE /api/v1/youtube-oac/:id
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const record = await YouTubeOAC.findById(req.params.id);

    if (!record) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Request not found",
      });
    }

    await record.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "YouTube OAC request deleted successfully.",
    });
  }),
};
