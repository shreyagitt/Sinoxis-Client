import { Request, Response } from "express";
import Label from "../models/Label";
import { asyncHandler } from "../middlewares/errorHandler";
import cloudinary from "../config/cloudinary";
import { HTTP_STATUS } from "../config/constants";
import fs from "fs";

/* =====================================================
   HELPER: Upload to Cloudinary
===================================================== */
const uploadToCloudinary = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "labels/aadhar",
    resource_type: "image",
  });

  fs.unlinkSync(file.path); // remove temp file

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const AdminLabelController = {

  /* LIST */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const labels = await Label.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: labels,
      total: labels.length,
    });
  }),

  /* GET ONE */
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findById(req.params.id).select("-__v");

    if (!label) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Label not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: label,
    });
  }),

  /* CREATE */
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

    const label = await Label.create({
      ...body,
      createdBy: body.createdBy,
      aadharFront,
      aadharFrontId,
      aadharBack,
      aadharBackId,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Label created successfully",
      data: label,
    });
  }),

  /* UPDATE STATUS */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const ALLOWED_STATUS = ["Active", "Pending", "Rejected", "Inactive"];
    const { status } = req.body;

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const label = await Label.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!label) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Label not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: label,
    });
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
  const label = await Label.findById(req.params.id);

  if (!label) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: "Label not found",
    });
  }

  const body: any = req.body;

  const files = req.files as {
    aadharFront?: Express.Multer.File[];
    aadharBack?: Express.Multer.File[];
  };

  // Replace Aadhar Front
  if (files?.aadharFront?.[0]) {
    if (label.aadharFrontId) {
      await cloudinary.uploader.destroy(label.aadharFrontId);
    }

    const upload = await uploadToCloudinary(files.aadharFront[0]);
    body.aadharFront = upload.url;
    body.aadharFrontId = upload.publicId;
  }

  // Replace Aadhar Back
  if (files?.aadharBack?.[0]) {
    if (label.aadharBackId) {
      await cloudinary.uploader.destroy(label.aadharBackId);
    }

    const upload = await uploadToCloudinary(files.aadharBack[0]);
    body.aadharBack = upload.url;
    body.aadharBackId = upload.publicId;
  }

  const updated = await Label.findByIdAndUpdate(
    req.params.id,
    body,
    { new: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Label updated successfully",
    data: updated,
  });
}),

  /* DELETE */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findById(req.params.id);

    if (!label) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
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

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Label deleted successfully",
    });
  }),
};