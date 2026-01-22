import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { User } from "../models/User";

export const userController = {

  // ───── GET ALL CLIENT USERS ─────
  list: asyncHandler(async (_req: Request, res: Response) => {
    const users = await User.find({ role: "client" })   // 🔥 filter only clients
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      total: users.length,   // for admin dashboard
    });
  }),

  // ───── GET SINGLE CLIENT USER ─────
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({
      _id: req.params.id,
      role: "client",       // 🔥 ensure only clients can be fetched
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Client user not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  }),

// ───── TOGGLE USER BLOCK ─────
block: asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  // 🔥 Prevent blocking admins (role-based, type-safe)
  if (user.role === "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin users cannot be blocked",
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? "unblocked" : "blocked"} successfully`,
    data: {
      id: user._id,
      isActive: user.isActive,
    },
  });
}),


  // ───── DELETE CLIENT USER ─────
  delete: asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      role: "client",       // 🔥 prevent deleting admins
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Client user not found",
      });
    }

    res.json({
      success: true,
      message: "Client user deleted successfully",
    });
  }),
};
