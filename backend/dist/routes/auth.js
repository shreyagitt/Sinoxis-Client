"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const types_1 = require("../types");
const router = (0, express_1.Router)();
/* -------------------- HEALTH CHECK -------------------- */
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Sinoxis Backend API running",
        timestamp: new Date().toISOString(),
    });
});
/* -------------------- PUBLIC AUTH -------------------- */
router.post("/client/login", authController_1.loginValidation, authController_1.AuthController.loginClient);
router.post("/admin/login", authController_1.loginValidation, authController_1.AuthController.loginAdmin);
router.post("/client/register", authController_1.registerValidation, authController_1.AuthController.registerClient);
/* -------------------- ADMIN REGISTRATION -------------------- */
// ⭐ Only SUPER ADMIN can create an ADMIN
router.post("/admin/register", auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.SUPERADMIN), authController_1.registerValidation, authController_1.AuthController.registerAdmin);
// -------------------- FIRST SUPERADMIN SETUP --------------------
router.post("/superadmin/init", authController_1.registerValidation, authController_1.AuthController.registerSuperAdmin);
/* -------------------- TOKEN REFRESH -------------------- */
router.post("/refresh-token", authController_1.AuthController.refreshToken);
/* -------------------- PROTECTED ROUTES -------------------- */
router.get("/profile", auth_1.authenticate, authController_1.AuthController.getProfile);
router.post("/logout", auth_1.authenticate, authController_1.AuthController.logout);
router.post("/change-password", auth_1.authenticate, authController_1.changePasswordValidation, authController_1.AuthController.changePassword);
exports.default = router;
