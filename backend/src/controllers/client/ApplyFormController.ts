import { Request, Response } from "express";
import ClientApplication from "../../models/ApplyForm";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientApplicationController = {
  /**
   * @route POST /api/v1/client/apply
   * @desc Submit a client application
   */
  submit: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;

    // Ensure releasedBefore is boolean
    if (typeof body.releasedBefore === "string") {
      body.releasedBefore = body.releasedBefore === "true";
    }

    const application = await ClientApplication.create(body);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  }),

  /**
   * @route GET /api/v1/client/apply
   * @desc Get all submitted applications
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const applications = await ClientApplication.find().sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      total: applications.length,
      data: applications,
    });
  }),
};
