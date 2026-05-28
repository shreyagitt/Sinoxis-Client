import { Request, Response } from "express";
import fs from "fs";
import cloudinary from "../../config/cloudinary";
import Metadata from "../../models/Metadata";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const MetadataController = {
  /**
   * 📤 Submit Metadata
   * POST /api/v1/client/metadata
   */
  submit: asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    let uploadResult;

    if (file) {
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "sinoxis/metadata_artworks",
      });
      fs.unlinkSync(file.path); // Remove temp file
    }

    const data = {
      ...req.body,
      artwork: uploadResult?.secure_url || null,
      artworkId: uploadResult?.public_id || null,
    };

    const metadata = await Metadata.create(data);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Metadata submitted successfully",
      data: metadata,
    });
  }),

  /**
   * 📋 List all metadata submissions
   * GET /api/v1/client/metadata
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const records = await Metadata.find().sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: records,
    });
  }),
};
