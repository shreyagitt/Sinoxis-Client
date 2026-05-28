import { Request, Response } from "express";
import fs from "fs";
import cloudinary from "../../config/cloudinary";
import FacebookVideo from "../../models/FacebookVideo";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const FacebookVideoController = {
  /**
   * 📨 Submit new Facebook Video claim
   * POST /api/v1/client/facebook-video
   */
  submit: asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    let uploadResult;

    if (file) {
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "sinoxis/facebook_claims",
      });
      fs.unlinkSync(file.path); // delete temp file
    }

    const data = {
      ...req.body,
      screenshotFb: uploadResult?.secure_url || null,
      screenshotFbId: uploadResult?.public_id || null,
    };

    const claim = await FacebookVideo.create(data);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Facebook video claim submitted successfully.",
      data: claim,
    });
  }),

  /**
   * 📋 List all claims (for user view)
   * GET /api/v1/client/facebook-video
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const claims = await FacebookVideo.find().sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: claims,
    });
  }),
};
