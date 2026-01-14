import { Request, Response } from "express";
import Release from "../models/Release";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";

/* =====================================================
   GET ALL RELEASES (ADMIN)
   ===================================================== */
export const getAllReleases = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await Release.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  }
);

/* =====================================================
   UPDATE RELEASE STATUS (ADMIN)
   ===================================================== */
export const updateReleaseStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;

  const allowedStatuses = [
  "Pending",
  "Approved",
  "Rejected",
  "Inactive",
  "Unfinished",
  "Action Required",
];


    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const release = await Release.findById(req.params.id);

    if (!release) {
      return res.status(404).json({
        success: false,
        message: "Release not found",
      });
    }

    release.status = status;
    await release.save();

    res.json({ success: true, data: release });
  }
);

/* =====================================================
   DELETE RELEASE (ADMIN – HARD DELETE)
   ===================================================== */
export const deleteReleaseByAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const release = await Release.findById(req.params.id);

    if (!release) {
      return res.status(404).json({
        success: false,
        message: "Release not found",
      });
    }

    /* ===== DELETE COVER FROM CLOUDINARY (SAFE) ===== */
    if (release.coverImageId) {
      try {
        await cloudinary.uploader.destroy(release.coverImageId);
      } catch (err) {
        console.error(
          "Cloudinary delete failed:",
          release.coverImageId,
          err
        );
        // DO NOT throw — continue deletion
      }
    }

    await release.deleteOne();

    res.json({
      success: true,
      message: "Release deleted permanently by admin",
    });
  }
);
