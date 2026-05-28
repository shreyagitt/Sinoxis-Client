"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidation = exports.registerValidation = exports.loginValidation = exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
const constants_1 = require("../config/constants");
const errorHandler_1 = require("../middlewares/errorHandler");
const index_1 = require("../types/index");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
// ============================================================
// 📌 CLIENT LOGIN
// ============================================================
AuthController.loginClient = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: "Validation failed",
            details: errors.array(),
        });
    }
    const loginData = req.body;
    // ⭐ ENFORCE CLIENT ONLY LOGIN
    const result = await authService_1.AuthService.login(loginData, index_1.UserRole.CLIENT);
    return res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        data: result,
        message: "Client login successful",
    });
});
// ============================================================
// 📌 ADMIN LOGIN
// ============================================================
AuthController.loginAdmin = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: "Validation failed",
            details: errors.array(),
        });
    }
    const loginData = req.body;
    // DO NOT enforce a single role here
    const result = await authService_1.AuthService.login(loginData);
    // Allow ADMIN + SUPERADMIN
    if (![index_1.UserRole.ADMIN, index_1.UserRole.SUPERADMIN].includes(result.user.role)) {
        return res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: "Only Admin or Superadmin can access admin panel",
        });
    }
    return res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        data: result,
        message: "Admin login successful",
    });
});
// ============================================================
// 📌 REGISTER CLIENT (PUBLIC)
// ============================================================
AuthController.registerClient = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: "Validation failed",
            details: errors.array(),
        });
    }
    const registerData = {
        ...req.body,
        role: index_1.UserRole.CLIENT, // ⭐ Force role = client
    };
    const result = await authService_1.AuthService.register(registerData);
    return res.status(constants_1.HTTP_STATUS.CREATED).json({
        success: true,
        data: result,
        message: "Client registered successfully",
    });
});
// ============================================================
// 📌 REGISTER ADMIN (ONLY SUPER ADMIN CAN DO THIS)
// ============================================================
AuthController.registerAdmin = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const requester = req.user;
    if (requester?.role !== index_1.UserRole.SUPERADMIN) {
        return res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: "Only superadmins can create admins",
        });
    }
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: "Validation failed",
            details: errors.array(),
        });
    }
    const registerData = {
        ...req.body,
        role: index_1.UserRole.ADMIN,
    };
    const result = await authService_1.AuthService.register(registerData);
    return res.status(constants_1.HTTP_STATUS.CREATED).json({
        success: true,
        data: result,
        message: "Admin created successfully",
    });
});
AuthController.registerSuperAdmin = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { User } = await Promise.resolve().then(() => __importStar(require("../models/User")));
    const existingSuperAdmin = await User.findOne({ role: index_1.UserRole.SUPERADMIN });
    if (existingSuperAdmin) {
        return res.status(403).json({
            success: false,
            error: "Super Admin already exists",
        });
    }
    const registerData = {
        ...req.body,
        role: index_1.UserRole.SUPERADMIN,
    };
    const result = await authService_1.AuthService.register(registerData);
    return res.status(201).json({
        success: true,
        data: result,
        message: "Super Admin created successfully",
    });
});
// ============================================================
// ♻️ REFRESH TOKEN
// ============================================================
AuthController.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: "Refresh token is required",
        });
    }
    const result = await authService_1.AuthService.refreshToken(refreshToken);
    return res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        data: result,
        message: "Token refreshed successfully",
    });
});
// ============================================================
// 👤 GET PROFILE
// ============================================================
AuthController.getProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    return res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        data: req.user,
        message: "Profile retrieved successfully",
    });
});
// ============================================================
// 🔐 CHANGE PASSWORD
// ============================================================
AuthController.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const userId = user?.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!userId) {
        return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: "Unauthorized",
        });
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: "All fields are required",
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: "Passwords do not match",
        });
    }
    const { User } = await Promise.resolve().then(() => __importStar(require("../models/User")));
    const bcrypt = (await Promise.resolve().then(() => __importStar(require("bcryptjs")))).default;
    const foundUser = await User.findById(userId).select("+password");
    if (!foundUser)
        return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
            success: false,
            error: "User not found",
        });
    const isMatch = await bcrypt.compare(currentPassword, foundUser.password);
    if (!isMatch)
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: "Incorrect current password",
        });
    foundUser.password = newPassword;
    await foundUser.save();
    return res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        message: "Password changed successfully",
    });
});
// ============================================================
// 🚪 LOGOUT
// ============================================================
AuthController.logout = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    return res.status(constants_1.HTTP_STATUS.OK).json({
        success: true,
        message: "Logout successful",
    });
});
/* ============================================================
   VALIDATION SCHEMAS
   ============================================================ */
exports.loginValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];
exports.registerValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must include uppercase, lowercase, and a number"),
    (0, express_validator_1.body)("firstName").trim().isLength({ min: 2, max: 50 }),
    (0, express_validator_1.body)("lastName").trim().isLength({ min: 2, max: 50 }),
];
exports.changePasswordValidation = [
    (0, express_validator_1.body)("currentPassword").isLength({ min: 8 }),
    (0, express_validator_1.body)("newPassword")
        .isLength({ min: 8 })
        .matches(/[0-9!@#$%^&*]/)
        .withMessage("Password must include a number or special character"),
    (0, express_validator_1.body)("confirmPassword")
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage("Passwords do not match"),
];
