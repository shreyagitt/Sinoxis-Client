import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthService } from "../services/authService";
import { HTTP_STATUS } from "../config/constants";
import { asyncHandler } from "../middlewares/errorHandler";
import { LoginRequest, RegisterRequest } from "../types/index";

export class AuthController {
  /**
   * 🧩 User Login
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const loginData: LoginRequest = req.body;
    const result = await AuthService.login(loginData);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: "Login successful",
    });
  });

  /**
   * 📝 Register User
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const registerData: RegisterRequest = req.body;
    const result = await AuthService.register(registerData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result,
      message: "Registration successful",
    });
  });

  /**
   * ♻️ Refresh Token
   */
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: "Token refreshed successfully",
    });
  });

  /**
   * 👤 Get Profile
   */
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user,
      message: "Profile retrieved successfully",
    });
  });

  /**
 * 🔐 Change Password
 */
static changePassword = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user; // from middleware
const userId = user?.userId; // ✅ use userId instead of _id
  const { currentPassword, newPassword, confirmPassword } = req.body;

 if (!userId) {
  return res.status(HTTP_STATUS.UNAUTHORIZED).json({
    success: false,
    error: "Unauthorized access",
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


const existingUser = await (await import("../models/User")).User
  .findById(userId)
  .select("+password");
    if (!existingUser) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: "User not found",
    });
  }

  const bcrypt = (await import("bcryptjs")).default;
  const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
  if (!isMatch) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: "Incorrect current password",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  existingUser.password = hashedPassword;
  await existingUser.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Password changed successfully",
  });
});


  /**
   * 🚪 Logout
   */
  static logout = asyncHandler(async (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Logout successful",
    });
  });
}

/**
 * ✅ Validation Middleware
 */
export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and a number"),
  body("firstName").trim().isLength({ min: 2, max: 50 }),
  body("lastName").trim().isLength({ min: 2, max: 50 }),
];

export const changePasswordValidation = [
  body("currentPassword")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Current password must be at least 8 characters"),
  body("newPassword")
    .isLength({ min: 8 })
    .matches(/[0-9!@#$%^&*]/)
    .withMessage("New password must include a number or special character"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];

