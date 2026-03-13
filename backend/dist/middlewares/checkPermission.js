"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const constants_1 = require("../config/constants");
const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
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
            return res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: "Permission denied",
            });
        }
        next();
    };
};
exports.checkPermission = checkPermission;
