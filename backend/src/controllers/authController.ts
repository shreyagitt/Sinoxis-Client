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
