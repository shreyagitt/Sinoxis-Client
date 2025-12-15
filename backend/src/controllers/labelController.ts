import { Request, Response } from "express";
import Label from "../models/Label";
import { asyncHandler } from "../middlewares/errorHandler";
import cloudinary from "../config/cloudinary";

export const AdminLabelController = {

  /* ────────────────────────────────────────────────
     LIST ALL LABELS
  ──────────────────────────────────────────────── */
  list: asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const labels = await Label.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: labels,
    });
  }),

  /* ────────────────────────────────────────────────
     GET SINGLE LABEL
  ──────────────────────────────────────────────── */
  getOne: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const label = await Label.findById(req.params.id);

    if (!label) {
      res.status(404).json({ success: false, message: "Label not found" });
      return;
    }

    res.json({
      success: true,
      data: label,
    });
  }),

  /* ────────────────────────────────────────────────
     UPDATE LABEL STATUS
  ──────────────────────────────────────────────── */
  updateStatus: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;

    const label = await Label.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!label) {
      res.status(404).json({ success: false, message: "Label not found" });
      return;
    }

    res.json({
      success: true,
      data: label,
    });
  }),

  /* ────────────────────────────────────────────────
     DELETE LABEL
  ──────────────────────────────────────────────── */
  delete: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const label = await Label.findById(req.params.id);

    if (!label) {
      res.status(404).json({ success: false, message: "Label not found" });
      return;
    }

    // Delete cloudinary images
    if (label.aadharFrontId) await cloudinary.uploader.destroy(label.aadharFrontId);
    if (label.aadharBackId) await cloudinary.uploader.destroy(label.aadharBackId);

    await Label.findByIdAndDelete(label._id);

    res.json({
      success: true,
      message: "Label deleted successfully",
    });
  }),

};
