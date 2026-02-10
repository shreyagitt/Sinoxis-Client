import { Request, Response } from "express";
import Label from "../models/Label";
import { asyncHandler } from "../middlewares/errorHandler";
import cloudinary from "../config/cloudinary";

export const AdminLabelController = {
  /* ────────────────────────────────────────────────
     LIST ALL LABELS (ADMIN)
  ──────────────────────────────────────────────── */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const labels = await Label.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: labels,
      total: labels.length,
    });
  }),

  /* ────────────────────────────────────────────────
     GET SINGLE LABEL
  ──────────────────────────────────────────────── */
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findById(req.params.id).select("-__v");

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found",
      });
    }

    res.json({
      success: true,
      data: label,
    });
  }),

  /* ────────────────────────────────────────────────
     UPDATE LABEL STATUS (APPROVE / REJECT / PENDING)
  ──────────────────────────────────────────────── */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    const ALLOWED_STATUS = ["pending", "approved", "rejected"];

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const label = await Label.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-__v");

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found",
      });
    }

    res.json({
      success: true,
      data: label,
    });
  }),

  /* ────────────────────────────────────────────────
     DELETE LABEL (ADMIN – HARD DELETE)
  ──────────────────────────────────────────────── */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findById(req.params.id);

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found",
      });
    }

    // 🔥 Safely delete Cloudinary assets
    if (label.aadharFrontId) {
      await cloudinary.uploader.destroy(label.aadharFrontId, {
        resource_type: "image",
      });
    }

    if (label.aadharBackId) {
      await cloudinary.uploader.destroy(label.aadharBackId, {
        resource_type: "image",
      });
    }

    await label.deleteOne();

    res.json({
      success: true,
      message: "Label deleted successfully",
    });
  }),
};
