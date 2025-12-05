import { Request, Response } from "express";
import ClientApplication from "../models/ApplyForm";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminApplicationController = {
  /**
   * @route GET /api/v1/applications
   * @desc Admin — list all submitted applications
   */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const applications = await ClientApplication.find().sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      total: applications.length,
      data: applications,
    });
  }),

  /**
   * @route POST /api/v1/applications
   * @desc Admin — create a new application manually (if needed)
   */
  create: asyncHandler(async (req: Request, res: Response) => {
    const {
      fullName,
      artistName,
      email,
      phone,
      instagram,
      youtube,
      labelName,
      releasedBefore,
      heardAbout,
    } = req.body;

    // 🛑 Basic validation
    if (!fullName || !email || !phone) {
      return res.status(400).json({
        status: false,
        message: "Full name, email, and phone are required.",
      });
    }

    // Ensure boolean
    const releasedBeforeBool =
      typeof releasedBefore === "string"
        ? releasedBefore === "true"
        : Boolean(releasedBefore);

    const newApplication = await ClientApplication.create({
      fullName,
      artistName,
      email,
      phone,
      instagram,
      youtube,
      labelName,
      releasedBefore: releasedBeforeBool,
      heardAbout,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      status: true,
      message: "Application created successfully",
      data: newApplication,
    });
  }),

  /**
   * @route PATCH /api/v1/applications/:id/status
   * @desc Admin — update status (Reviewed, Accepted, Rejected)
   */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  const allowed = ["Pending", "Approved", "Rejected"];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value.",
    });
  }

  const updated = await ClientApplication.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Application not found",
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Application status updated",
    data: updated,
  });
}),


  /**
   * @route DELETE /api/v1/applications/:id
   * @desc Admin — delete application
   */
  delete: asyncHandler(async (req: Request, res: Response) => {
    await ClientApplication.findByIdAndDelete(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Application deleted successfully",
    });
  }),
};
