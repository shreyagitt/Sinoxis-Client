import { Request, Response } from "express";
import Label from "../../models/Label";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientLabelController = {

  // List all ACTIVE labels
  list: asyncHandler(async (_req: Request, res: Response) => {
    const labels = await Label.find({ status: "Active" }).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: labels
    });
  }),

  // Get single label
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const label = await Label.findById(req.params.id);

    if (!label)
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Label not found",
      });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: label,
    });
  }),

};
