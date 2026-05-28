import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { User } from "../models/User";

export const userController = {
  /* ============================================================
     GET ALL CLIENT USERS
     ============================================================ */
  list: asyncHandler(async (_req: Request, res: Response) => {
    const users = await User.find({ role: "client" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      total: users.length,
    });
  }),

  /* ============================================================
     GET SINGLE CLIENT USER
     ============================================================ */
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({
      _id: req.params.id,
      role: "client",
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

  /* ============================================================
     ADD CLIENT USER (ADMIN)
     ============================================================ */
  create: asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, password } = req.body;
    const email = req.body.email?.toLowerCase().trim();

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Prevent duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // ⚠️ DO NOT hash here — model handles it
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,        // ✅ plain password
      role: "client",  // enforced
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Client user added successfully",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  }),

  /* ============================================================
   UPDATE CLIENT USER DETAILS
   ============================================================ */
update: asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, isActive } = req.body;

  // Normalize email if provided
  const normalizedEmail = email ? email.toLowerCase().trim() : undefined;

  // Find client user
  const user = await User.findOne({
    _id: req.params.id,
    role: "client",
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Client user not found",
    });
  }

  // Prevent email conflict
  if (normalizedEmail && normalizedEmail !== user.email) {
    const emailExists = await User.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        error: "Email already in use by another user",
      });
    }
  }

  // Update allowed fields only
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (normalizedEmail !== undefined) user.email = normalizedEmail;
  if (typeof isActive === "boolean") user.isActive = isActive;

  await user.save();

  res.json({
    success: true,
    message: "Client user updated successfully",
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      updatedAt: user.updatedAt,
    },
  });
}),

/* ============================================================
   UPDATE CLIENT USER PERMISSIONS (ADMIN)
   ============================================================ */
updatePermissions: asyncHandler(async (req: Request, res: Response) => {
  const { permissions } = req.body;

  if (!permissions || typeof permissions !== "object") {
    return res.status(400).json({
      success: false,
      error: "Permissions object is required",
    });
  }

  const user = await User.findOne({
    _id: req.params.id,
    role: "client",
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Client user not found",
    });
  }

  // ✅ MERGE permissions (IMPORTANT)
  user.permissions = {
    ...user.permissions,
    ...permissions,
  };

  await user.save();

  res.json({
    success: true,
    message: "User permissions updated successfully",
    data: {
      _id: user._id,
      permissions: user.permissions,
      updatedAt: user.updatedAt,
    },
  });
}),
  /* ============================================================
     BLOCK / UNBLOCK CLIENT USER
     ============================================================ */
  block: asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Only clients can be blocked
    if (user.role !== "client") {
      return res.status(403).json({
        success: false,
        error: "Only client users can be blocked",
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

  /* ============================================================
     DELETE CLIENT USER
     ============================================================ */
  delete: asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      role: "client",
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
