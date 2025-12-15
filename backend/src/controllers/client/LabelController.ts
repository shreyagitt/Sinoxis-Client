import { Request, Response } from "express";
import Label from "../../models/Label";
import { asyncHandler } from "../../middlewares/errorHandler";
import cloudinary from "../../config/cloudinary";

/* ----------------------------------------------------------
   Types to avoid TS errors
---------------------------------------------------------- */

// Extend Express Request to allow user + files
interface AuthRequest extends Request {
  user?: any;
  files?: {
    aadharFront?: Express.Multer.File[];
    aadharBack?: Express.Multer.File[];
  };
}

export const ClientLabelController = {

  /* ============================================================
     LIST LABELS (CLIENT-SPECIFIC)
  ============================================================ */
  list: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const labels = await Label.find({ createdBy: req.user?.id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      data: labels,
    });
  }),

  /* ============================================================
     GET ONE LABEL
  ============================================================ */
  getOne: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const label = await Label.findOne({
      _id: req.params.id,
      createdBy: req.user?.id,
    });

    if (!label) {
      res.status(404).json({ success: false, message: "Label not found" });
      return;
    }

    res.json({ success: true, data: label });
  }),

  /* ============================================================
     CREATE LABEL (WITH CLOUDINARY IMAGE UPLOADS)
  ============================================================ */
  create: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const body = req.body;

    let aadharFront: string | null = null;
    let aadharFrontId: string | null = null;
    let aadharBack: string | null = null;
    let aadharBackId: string | null = null;

    // Upload front image
    if (req.files?.aadharFront?.[0]) {
      const upload = await cloudinary.uploader.upload(req.files.aadharFront[0].path);
      aadharFront = upload.secure_url;
      aadharFrontId = upload.public_id;
    }

    // Upload back image
    if (req.files?.aadharBack?.[0]) {
      const upload = await cloudinary.uploader.upload(req.files.aadharBack[0].path);
      aadharBack = upload.secure_url;
      aadharBackId = upload.public_id;
    }

    // Set expiry = +5 years
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 5);

    const newLabel = await Label.create({
      ...body,
      aadharFront,
      aadharFrontId,
      aadharBack,
      aadharBackId,
      createdBy: req.user?.id,
      expiry,
    });

    res.status(201).json({
      success: true,
      data: newLabel,
    });
  }),

  /* ============================================================
     UPDATE LABEL (WITH CLOUDINARY REPLACEMENT)
  ============================================================ */
  update: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const label = await Label.findOne({
      _id: req.params.id,
      createdBy: req.user?.id,
    });

    if (!label) {
      res.status(404).json({ success: false, message: "Label not found" });
      return;
    }

    const body: any = req.body;

    // Replace Front image
    if (req.files?.aadharFront?.[0]) {
      if (label.aadharFrontId) {
        await cloudinary.uploader.destroy(label.aadharFrontId);
      }

      const upload = await cloudinary.uploader.upload(req.files.aadharFront[0].path);
      body.aadharFront = upload.secure_url;
      body.aadharFrontId = upload.public_id;
    }

    // Replace Back image
    if (req.files?.aadharBack?.[0]) {
      if (label.aadharBackId) {
        await cloudinary.uploader.destroy(label.aadharBackId);
      }

      const upload = await cloudinary.uploader.upload(req.files.aadharBack[0].path);
      body.aadharBack = upload.secure_url;
      body.aadharBackId = upload.public_id;
    }

    const updated = await Label.findByIdAndUpdate(label._id, body, { new: true });

    res.json({
      success: true,
      data: updated,
    });
  }),

  /* ============================================================
     DELETE LABEL (ALSO DELETE CLOUDINARY IMAGES)
  ============================================================ */
  delete: asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const label = await Label.findOne({
      _id: req.params.id,
      createdBy: req.user?.id,
    });

    if (!label) {
      res.status(404).json({ success: false, message: "Label not found" });
      return;
    }

    // Delete Cloudinary images
    if (label.aadharFrontId) await cloudinary.uploader.destroy(label.aadharFrontId);
    if (label.aadharBackId) await cloudinary.uploader.destroy(label.aadharBackId);

    await Label.findByIdAndDelete(label._id);

    res.json({
      success: true,
      message: "Label deleted successfully",
    });
  }),

};
