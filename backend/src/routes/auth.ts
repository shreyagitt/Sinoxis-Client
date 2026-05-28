import { Router } from "express";
import {
  AuthController,
  loginValidation,
  registerValidation,
  changePasswordValidation,
} from "../controllers/authController";

import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../types";

const router = Router();

/* -------------------- HEALTH CHECK -------------------- */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sinoxis Backend API running",
    timestamp: new Date().toISOString(),
  });
});

/* -------------------- PUBLIC AUTH -------------------- */
router.post("/client/login", loginValidation, AuthController.loginClient);
router.post("/admin/login", loginValidation, AuthController.loginAdmin);
router.post("/client/register", registerValidation, AuthController.registerClient);

/* -------------------- ADMIN REGISTRATION -------------------- */
// ⭐ Only SUPER ADMIN can create an ADMIN
router.post(
  "/admin/register",
  authenticate,
  authorize(UserRole.SUPERADMIN),
  registerValidation,
  AuthController.registerAdmin
);

// -------------------- FIRST SUPERADMIN SETUP --------------------
router.post(
  "/superadmin/init",
  registerValidation,
  AuthController.registerSuperAdmin
);


/* -------------------- TOKEN REFRESH -------------------- */
router.post("/refresh-token", AuthController.refreshToken);

/* -------------------- PROTECTED ROUTES -------------------- */
router.get("/profile", authenticate, AuthController.getProfile);
router.post("/logout", authenticate, AuthController.logout);
router.post(
  "/change-password",
  authenticate,
  changePasswordValidation,
  AuthController.changePassword
);

export default router;


