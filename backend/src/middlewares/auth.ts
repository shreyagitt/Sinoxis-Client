import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { ERROR_MESSAGES, HTTP_STATUS } from "../config/constants";

// Extend Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * ✅ Authentication middleware — verifies JWT token
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // ❌ No token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: "Access token is required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🔐 Validate token & attach user info
    const decoded = await AuthService.verifyToken(token);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_MESSAGES.UNAUTHORIZED,
    });
  }
};

/**
 * 🔐 Role-based authorization middleware
 *    Example: authorize("admin")
 *             authorize("client")
 *             authorize("admin", "client")
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    console.log("▶ AUTHORIZE CHECK:");
    console.log("   Allowed roles:", roles);
    console.log("   Req.user.role:", req.user?.role);

    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    // ⭐ SUPERADMIN CAN ACCESS EVERYTHING
    if (req.user.role.toLowerCase() === "superadmin") {
      return next();
    }

    if (!roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: ERROR_MESSAGES.FORBIDDEN,
      });
    }

    next();
  };
};



/**
 * 🟡 Optional authentication (guest allowed)
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = await AuthService.verifyToken(token);
        req.user = decoded;
      } catch {
        req.user = undefined; // invalid token → treat as guest
      }
    }
  } catch {
    req.user = undefined;
  }

  next();
};
