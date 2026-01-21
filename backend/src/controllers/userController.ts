import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { User } from "../models/User";

export const userController = {

  // ───── GET ALL USERS ─────
  list: asyncHandler(async (_req: Request, res: Response) => {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      total: users.length,   // 🔥 for admin dashboard
    });
  }),

  // ───── GET SINGLE USER ─────
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  }),

  // ───── DELETE USER ─────
  delete: asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  }),
};
