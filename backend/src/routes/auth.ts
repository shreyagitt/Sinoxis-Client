import { Router, Request, Response, NextFunction } from "express";
import { AuthController,
   loginValidation, 
   registerValidation ,
  changePasswordValidation, } 
  from "../controllers/authController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// ----------------------
// Health Check
// ----------------------
router.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Sinoxis Admin Backend API is running",
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || "v1",
  });
});

// ----------------------
// Public Routes
// ----------------------
router.post("/login", loginValidation, (req: Request, res: Response, next: NextFunction) =>
  AuthController.login(req, res, next)
);

router.post("/register", registerValidation, (req: Request, res: Response, next: NextFunction) =>
  AuthController.register(req, res, next)
);

router.post("/refresh-token", (req: Request, res: Response, next: NextFunction) =>
  AuthController.refreshToken(req, res, next)
);

// ----------------------
// Protected Routes
// ----------------------
router.get("/profile", authenticate, (req: Request, res: Response, next: NextFunction) =>
  AuthController.getProfile(req, res, next)
);

router.post("/logout", authenticate, (req: Request, res: Response, next: NextFunction) =>
  AuthController.logout(req, res, next)
);

router.post(
  "/change-password",
  authenticate,
  changePasswordValidation,
  (req: Request, res: Response, next: NextFunction) => AuthController.changePassword(req, res, next)
);

export default router;
