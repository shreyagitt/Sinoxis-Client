import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { HTTP_STATUS } from "../config/constants";

export const checkPermission = (permission: string) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // Superadmin bypass
    if (req.user.role === "superadmin") {
      return next();
    }

    // Permission check
    if (!req.user.permissions?.[permission]) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: "Permission denied",
      });
    }

    next();
  };
};