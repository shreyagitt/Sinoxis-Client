import { Request, Response } from "express";
import SocialISRC from "../../models/SocialISRC";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientSocialISRCController = {
  /**
   * 📤 Submit Social ISRC Form
   * POST /api/v1/client/social-isrc
   */
  submit: asyncHandler(async (req: Request, res: Response) => {
    const submission = await SocialISRC.create(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Social Profile & ISRC details submitted successfully.",
      data: submission,
    });
  }),

  /**
   * 📋 List All Submissions (for client)
   * GET /api/v1/client/social-isrc
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const submissions = await SocialISRC.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: submissions,
    });
  }),
};
