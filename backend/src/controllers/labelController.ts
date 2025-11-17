import { Request, Response } from "express";
import Label from "../models/Label";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminLabelController = {

  create: asyncHandler(async (req: Request, res: Response) => {
    const file = (req as any).file;

    const label = await Label.create({
      ...req.body,
      labelImage: file?.path || null,
      labelImageId: file?.filename || null,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: label,
      message: "Label created successfully",
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findById(req.params.id);
    if (!label)
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Label not found",
      });

    const file = (req as any).file;

    if (file) {
      if (label.labelImageId) {
        await cloudinary.uploader.destroy(label.labelImageId);
      }
      req.body.labelImage = file.path;
      req.body.labelImageId = file.filename;
    }

    const updated = await Label.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: updated,
      message: "Label updated successfully",
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findById(req.params.id);
    if (!label)
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Label not found",
      });

    if (label.labelImageId) {
      await cloudinary.uploader.destroy(label.labelImageId);
    }

    await label.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Label deleted successfully",
    });
  }),

};
