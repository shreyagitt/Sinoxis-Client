import { Request, Response } from "express";
import Application from "../../models/ApplyForm";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientApplicationController = {
  // POST /api/v1/client/apply
  submit: asyncHandler(async (req: Request, res: Response) => {
    const application = await Application.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  }),

  // GET /api/v1/client/apply
  list: asyncHandler(async (_req: Request, res: Response) => {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: applications,
    });
  }),
};
