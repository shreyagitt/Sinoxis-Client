"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.createError = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const constants_1 = require("../config/constants");
const index_1 = require("../types/index");
// Unified error creator
const createError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
exports.createError = createError;
class AuthService {
    /**
     * 🔐 Generate a JWT token
     */
    static generateToken(payload, expiresIn) {
        const options = {
            expiresIn: expiresIn,
        };
        return jsonwebtoken_1.default.sign(payload, constants_1.JWT_CONFIG.SECRET, options);
    }
    /**
     * 🔁 Generate access & refresh tokens
     */
    static generateTokens(user) {
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            // ⭐ ROLE INCLUDED
        };
        return {
            token: this.generateToken(payload, constants_1.JWT_CONFIG.EXPIRES_IN),
            refreshToken: this.generateToken(payload, constants_1.JWT_CONFIG.REFRESH_EXPIRES_IN),
        };
    }
    //Login method with role-based access control
    static async login(loginData, expectedRole) {
        const { email, password } = loginData;
        // 1️⃣ Find user
        const user = await User_1.User.findOne({ email });
        if (!user)
            throw (0, exports.createError)(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
        // 2️⃣ Check if active
        if (!user.isActive)
            throw (0, exports.createError)("Account is deactivated", 401);
        // 3️⃣ Role-based login rules
        if (expectedRole) {
            if (expectedRole === index_1.UserRole.ADMIN) {
                // ⭐ Allow ADMIN and SUPERADMIN
                if (![index_1.UserRole.ADMIN, index_1.UserRole.SUPERADMIN].includes(user.role)) {
                    throw (0, exports.createError)("Unauthorized: Only Admin or Superadmin can login here", 403);
                }
            }
            else if (user.role !== expectedRole) {
                // Normal strict match (client login)
                throw (0, exports.createError)(`Unauthorized: Only ${expectedRole} can login here`, 403);
            }
        }
        // 4️⃣ Validate password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid)
            throw (0, exports.createError)(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
        // 5️⃣ Update lastLogin
        user.lastLogin = new Date();
        await user.save();
        // 6️⃣ Issue JWT
        const { token, refreshToken } = this.generateTokens(user);
        return {
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                permissions: user.permissions,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                balance: user.balance ?? 0,
                // ✅ REQUIRED FIX
            },
            token,
            refreshToken,
        };
    }
    /**
     * 📝 Register new user (RBAC safe)
     */
    static async register(registerData) {
        const { email, password, firstName, lastName, role } = registerData;
        // 1️⃣ Prevent duplicate
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser)
            throw (0, exports.createError)(constants_1.ERROR_MESSAGES.USER_EXISTS, 409);
        // 2️⃣ Create new user (default CLIENT)
        const newUser = new User_1.User({
            email,
            password,
            firstName,
            lastName,
            role: role || index_1.UserRole.CLIENT, // ⭐ DEFAULT CLIENT
            isActive: true,
        });
        await newUser.save();
        // 3️⃣ Generate tokens
        const { token, refreshToken } = this.generateTokens(newUser);
        return {
            user: {
                _id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                isActive: newUser.isActive,
                permissions: newUser.permissions,
                lastLogin: newUser.lastLogin,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
                balance: newUser.balance ?? 0, // ✅ REQUIRED FIX
            },
            token,
            refreshToken,
        };
    }
    /**
     * ♻️ Refresh access token
     */
    static async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, constants_1.JWT_CONFIG.SECRET);
            const user = await User_1.User.findById(decoded.userId);
            if (!user || !user.isActive)
                throw (0, exports.createError)(constants_1.ERROR_MESSAGES.UNAUTHORIZED, 401);
            return {
                token: this.generateToken({ userId: user._id, email: user.email, role: user.role,
                    permissions: user.permissions,
                }, constants_1.JWT_CONFIG.EXPIRES_IN),
            };
        }
        catch {
            throw (0, exports.createError)(constants_1.ERROR_MESSAGES.UNAUTHORIZED, 401);
        }
    }
    /**
     * 🔎 Verify access token
     */
    static async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, constants_1.JWT_CONFIG.SECRET);
            const user = await User_1.User.findById(decoded.userId);
            if (!user || !user.isActive)
                throw (0, exports.createError)(constants_1.ERROR_MESSAGES.UNAUTHORIZED, 401);
            return decoded; // contains userId, email, role
        }
        catch {
            throw (0, exports.createError)(constants_1.ERROR_MESSAGES.UNAUTHORIZED, 401);
        }
    }
}
exports.AuthService = AuthService;
