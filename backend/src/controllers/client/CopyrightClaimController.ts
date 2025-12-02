import { Response } from "express";
import { asyncHandler } from "../../middlewares/errorHandler";
import { AuthenticatedRequest } from "../../middlewares/auth";
import CopyrightClaim from "../../models/CopyrightClaim";
import { HTTP_STATUS } from "../../config/constants";

export const ClientCopyrightClaimController = {

  // ⭐ Submit new copyright claim
  submit: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { platform, videoLink, notes } = req.body;

    const claim = await CopyrightClaim.create({
      userId: req.user!.userId,
      platform,
      videoLink,
      notes,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Request submitted successfully",
      data: claim,
    });
  }),

  // ⭐ List all claims submitted by logged-in client
  list: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const claims = await CopyrightClaim.find({
      userId: req.user!.userId,
    }).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: claims,
    });
  }),
};
