import { Request, Response } from "express";
import fs from "fs";
import cloudinary from "../../config/cloudinary";
import YouTubeClaim from "../../models/YouTubeClaim";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientYouTubeClaimController = {
  /**
   * 📤 Submit YouTube Claim
   * POST /api/v1/client/youtube-claim
   */
  submit: asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    let uploadResult;

    if (file) {
      uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "sinoxis/youtube_claims",
      });
      fs.unlinkSync(file.path); // delete temp file
    }

    const data = {
      ...req.body,
      screenshot: uploadResult?.secure_url || null,
      screenshotId: uploadResult?.public_id || null,
    };

    const claim = await YouTubeClaim.create(data);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "YouTube claim submitted successfully.",
      data: claim,
    });
  }),

  /**
   * 📋 List All Claims (Client View)
   * GET /api/v1/client/youtube-claim
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const claims = await YouTubeClaim.find().sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: claims,
    });
  }),
};
