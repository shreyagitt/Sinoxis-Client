"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const authService_1 = require("../services/authService");
const constants_1 = require("../config/constants");
/**
 * ✅ Authentication middleware — verifies JWT token
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: "Access token is required",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        // 🔐 Validate token & attach user info
        const decoded = await authService_1.AuthService.verifyToken(token);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            permissions: decoded.permissions,
        };
        return next();
    }
    catch (error) {
        return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: constants_1.ERROR_MESSAGES.UNAUTHORIZED,
        });
    }
};
exports.authenticate = authenticate;
/**
 * 🔐 Role-based authorization middleware
 *    Example: authorize("admin")
 *             authorize("client")
 *             authorize("admin", "client")
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        console.log("▶ AUTHORIZE CHECK:");
        console.log("   Allowed roles:", roles);
        console.log("   Req.user.role:", req.user?.role);
        if (!req.user) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: constants_1.ERROR_MESSAGES.UNAUTHORIZED,
            });
        }
        // ⭐ SUPERADMIN CAN ACCESS EVERYTHING
        if (req.user.role.toLowerCase() === "superadmin") {
            return next();
        }
        if (!roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
            return res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: constants_1.ERROR_MESSAGES.FORBIDDEN,
            });
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * 🟡 Optional authentication (guest allowed)
 */
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = await authService_1.AuthService.verifyToken(token);
                req.user = decoded;
            }
            catch {
                req.user = undefined; // invalid token → treat as guest
            }
        }
    }
    catch {
        req.user = undefined;
    }
    next();
};
exports.optionalAuth = optionalAuth;
