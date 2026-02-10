import { Request, Response } from "express";
import Label from "../../models/Label";
import { asyncHandler } from "../../middlewares/errorHandler";
import cloudinary from "../../config/cloudinary";
import fs from "fs";

/* ----------------------------------------------------------
   Helpers
---------------------------------------------------------- */

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const uploadToCloudinary = async (file: Express.Multer.File) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    //fs.unlinkSync(file.path);
    throw new Error(`Unsupported file type: ${file.mimetype}`);
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "labels/aadhar",
    resource_type: "image",
  });

  //fs.unlinkSync(file.path);

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

/* ----------------------------------------------------------
   Controller
---------------------------------------------------------- */

export const ClientLabelController = {
  /* ============================================================
     LIST LABELS
  ============================================================ */
  list: asyncHandler(async (req: Request, res: Response) => {
    const labels = await Label.find({
      createdBy: req.user!.userId,
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({ success: true, data: labels });
  }),

  /* ============================================================
     GET ONE LABEL
  ============================================================ */
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findOne({
      _id: req.params.id,
      createdBy: req.user!.userId,
    });

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found",
      });
    }

    res.json({ success: true, data: label });
  }),

  /* ============================================================
     CREATE LABEL
  ============================================================ */
  create: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;

    const files = req.files as {
      aadharFront?: Express.Multer.File[];
      aadharBack?: Express.Multer.File[];
    };

    let aadharFront, aadharFrontId;
    let aadharBack, aadharBackId;

    if (files?.aadharFront?.[0]) {
      const upload = await uploadToCloudinary(files.aadharFront[0]);
      aadharFront = upload.url;
      aadharFrontId = upload.publicId;
    }

    if (files?.aadharBack?.[0]) {
      const upload = await uploadToCloudinary(files.aadharBack[0]);
      aadharBack = upload.url;
      aadharBackId = upload.publicId;
    }

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 5);

    const label = await Label.create({
      ...body,
      aadharFront,
      aadharFrontId,
      aadharBack,
      aadharBackId,
      createdBy: req.user!.userId,
      expiry,
    });

    res.status(201).json({ success: true, data: label });
  }),

  /* ============================================================
     UPDATE LABEL
  ============================================================ */
  update: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findOne({
      _id: req.params.id,
      createdBy: req.user!.userId,
    });

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found",
      });
    }

    const body: any = req.body;

    const files = req.files as {
      aadharFront?: Express.Multer.File[];
      aadharBack?: Express.Multer.File[];
    };

    if (files?.aadharFront?.[0]) {
      if (label.aadharFrontId) {
        await cloudinary.uploader.destroy(label.aadharFrontId);
      }

      const upload = await uploadToCloudinary(files.aadharFront[0]);
      body.aadharFront = upload.url;
      body.aadharFrontId = upload.publicId;
    }

    if (files?.aadharBack?.[0]) {
      if (label.aadharBackId) {
        await cloudinary.uploader.destroy(label.aadharBackId);
      }

      const upload = await uploadToCloudinary(files.aadharBack[0]);
      body.aadharBack = upload.url;
      body.aadharBackId = upload.publicId;
    }

    const updated = await Label.findByIdAndUpdate(label._id, body, {
      new: true,
    });

    res.json({ success: true, data: updated });
  }),

  /* ============================================================
     DELETE LABEL
  ============================================================ */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findOne({
      _id: req.params.id,
      createdBy: req.user!.userId,
    });

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found",
      });
    }

    if (label.aadharFrontId) {
      await cloudinary.uploader.destroy(label.aadharFrontId);
    }
    if (label.aadharBackId) {
      await cloudinary.uploader.destroy(label.aadharBackId);
    }

    await label.deleteOne();

    res.json({
      success: true,
      message: "Label deleted successfully",
    });
  }),
};
