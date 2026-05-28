import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthService } from "../services/authService";
import { HTTP_STATUS } from "../config/constants";
import { asyncHandler } from "../middlewares/errorHandler";
import { LoginRequest, RegisterRequest, UserRole } from "../types/index";

export class AuthController {
  // ============================================================
  // 📌 CLIENT LOGIN
  // ============================================================
  static loginClient = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const loginData: LoginRequest = req.body;

    // ⭐ ENFORCE CLIENT ONLY LOGIN
    const result = await AuthService.login(loginData, UserRole.CLIENT);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: "Client login successful",
    });
  });

  // ============================================================
  // 📌 ADMIN LOGIN
  // ============================================================

  static loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
  }

  const loginData: LoginRequest = req.body;

  // DO NOT enforce a single role here
  const result = await AuthService.login(loginData);

  // Allow ADMIN + SUPERADMIN
  if (![UserRole.ADMIN, UserRole.SUPERADMIN].includes(result.user.role)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: "Only Admin or Superadmin can access admin panel",
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
    message: "Admin login successful",
  });
});


  // ============================================================
  // 📌 REGISTER CLIENT (PUBLIC)
  // ============================================================
  static registerClient = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const registerData: RegisterRequest = {
      ...req.body,
      role: UserRole.CLIENT, // ⭐ Force role = client
    };

    const result = await AuthService.register(registerData);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result,
      message: "Client registered successfully",
    });
  });

  // ============================================================
  // 📌 REGISTER ADMIN (ONLY SUPER ADMIN CAN DO THIS)
  // ============================================================
  static registerAdmin = asyncHandler(async (req: Request, res: Response) => {
    const requester = (req as any).user;

    if (requester?.role !== UserRole.SUPERADMIN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: "Only superadmins can create admins",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const registerData: RegisterRequest = {
      ...req.body,
      role: UserRole.ADMIN,
    };

    const result = await AuthService.register(registerData);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result,
      message: "Admin created successfully",
    });
  });


  static registerSuperAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { User } = await import("../models/User");

  const existingSuperAdmin = await User.findOne({ role: UserRole.SUPERADMIN });

  if (existingSuperAdmin) {
    return res.status(403).json({
      success: false,
      error: "Super Admin already exists",
    });
  }

  const registerData = {
    ...req.body,
    role: UserRole.SUPERADMIN,
  };

  const result = await AuthService.register(registerData);

  return res.status(201).json({
    success: true,
    data: result,
    message: "Super Admin created successfully",
  });
});


  // ============================================================
  // ♻️ REFRESH TOKEN
  // ============================================================
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: "Token refreshed successfully",
    });
  });

  // ============================================================
  // 👤 GET PROFILE
  // ============================================================
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: (req as any).user,
      message: "Profile retrieved successfully",
    });
  });

  // ============================================================
  // 🔐 CHANGE PASSWORD
  // ============================================================
  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user?.userId;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Passwords do not match",
      });
    }

    const { User } = await import("../models/User");
    const bcrypt = (await import("bcryptjs")).default;

    const foundUser = await User.findById(userId).select("+password");
    if (!foundUser)
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "User not found",
      });

    const isMatch = await bcrypt.compare(currentPassword, foundUser.password);
    if (!isMatch)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Incorrect current password",
      });

    foundUser.password = newPassword;
    await foundUser.save();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Password changed successfully",
    });
  });

  // ============================================================
  // 🚪 LOGOUT
  // ============================================================
  static logout = asyncHandler(async (_req: Request, res: Response) => {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Logout successful",
    });
  });
}

/* ============================================================
   VALIDATION SCHEMAS
   ============================================================ */
export const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const registerValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must include uppercase, lowercase, and a number"),
  body("firstName").trim().isLength({ min: 2, max: 50 }),
  body("lastName").trim().isLength({ min: 2, max: 50 }),
];

export const changePasswordValidation = [
  body("currentPassword").isLength({ min: 8 }),
  body("newPassword")
    .isLength({ min: 8 })
    .matches(/[0-9!@#$%^&*]/)
    .withMessage("Password must include a number or special character"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];
