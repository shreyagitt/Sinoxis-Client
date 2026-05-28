import { Request, Response } from "express";
import Metadata from "../models/Metadata";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const metadataController = {
  /**
   * 🧾 List all submissions
   * GET /api/v1/metadata
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await Metadata.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data });
  }),

  /**
   * 🧩 Update Metadata Status
   * PATCH /api/v1/metadata/:id/status
   */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!["Pending", "Reviewed", "Approved", "Rejected"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid status value",
      });
    }

    const updated = await Metadata.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Metadata entry not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    });
  }),

  /**
   * ❌ Delete Metadata (and remove artwork from Cloudinary)
   * DELETE /api/v1/metadata/:id
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const record = await Metadata.findById(req.params.id);

    if (!record) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Metadata entry not found",
      });
    }

    if (record.artworkId) {
      await cloudinary.uploader.destroy(record.artworkId);
    }

    await record.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Metadata entry deleted successfully",
    });
  }),
};
