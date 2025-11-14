import { Request, Response } from "express";
import Application from "../models/ApplyForm";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminApplicationController = {
  // GET /api/v1/applications
  list: asyncHandler(async (_req: Request, res: Response) => {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: applications,
    });
  }),

  // -----------------------------------------------------------
  // 📌 2. CREATE NEW APPLICATION
  // -----------------------------------------------------------
  async create(req: Request, res: Response) {
    try {
      const {
        fullName,
        email,
        phone,
        role,
        genre,
        musicLink,
        bio,
        agree
      } = req.body;

      // Basic validation
      if (!fullName || !email || !phone) {
        return res.status(400).json({
          status: false,
          message: "Full name, email, and phone are required.",
        });
      }

      const newApplication = await Application.create({
        fullName,
        email,
        phone,
        role,
        genre,
        musicLink,
        bio,
        agree,
      });

      return res.json({
        status: true,
        message: "Application created successfully",
        data: newApplication,
      });
    } catch (error: any) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  // PATCH /api/v1/applications/:id/status
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Application status updated",
      data: app,
    });
  }),

  // DELETE /api/v1/applications/:id
  delete: asyncHandler(async (req: Request, res: Response) => {
    await Application.findByIdAndDelete(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Application deleted successfully",
    });
  }),
};
