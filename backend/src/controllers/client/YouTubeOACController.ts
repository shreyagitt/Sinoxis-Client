import { Request, Response } from "express";
import YouTubeOAC from "../../models/YouTubeOAC";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientYouTubeOACController = {
  /**
   * 📨 Submit OAC Request
   * POST /api/v1/client/youtube-oac
   */
  submit: asyncHandler(async (req: Request, res: Response) => {
    const newRequest = await YouTubeOAC.create(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "YouTube OAC request submitted successfully.",
      data: newRequest,
    });
  }),

  /**
   * 📋 Get All OAC Requests (Client)
   * GET /api/v1/client/youtube-oac
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const requests = await YouTubeOAC.find().sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: requests,
    });
  }),
};
