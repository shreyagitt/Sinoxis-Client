"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFound = exports.errorHandler = exports.OperationalError = void 0;
const constants_1 = require("../config/constants");
/**
 * Custom operational error class
 */
class OperationalError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.OperationalError = OperationalError;
/**
 * Global error handling middleware
 */
const errorHandler = (error, req, res, next) => {
    let { statusCode = 500, message } = error;
    // ✅ Handle common Mongoose errors
    if (error.name === 'ValidationError') {
        statusCode = constants_1.HTTP_STATUS.BAD_REQUEST;
        message = constants_1.ERROR_MESSAGES.VALIDATION_ERROR;
    }
    if (error.name === 'MongoError' && error.code === 11000) {
        statusCode = constants_1.HTTP_STATUS.CONFLICT;
        message = 'Duplicate field value';
    }
    if (error.name === 'CastError') {
        statusCode = constants_1.HTTP_STATUS.BAD_REQUEST;
        message = 'Invalid ID format';
    }
    // ✅ Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
        statusCode = constants_1.HTTP_STATUS.UNAUTHORIZED;
        message = 'Invalid token';
    }
    if (error.name === 'TokenExpiredError') {
        statusCode = constants_1.HTTP_STATUS.UNAUTHORIZED;
        message = 'Token expired';
    }
    // ✅ Log details in development
    if (process.env.NODE_ENV === 'development') {
        console.error('🧩 Error Log:', {
            message: error.message,
            stack: error.stack,
            statusCode,
            path: req.originalUrl,
            method: req.method,
            body: req.body,
        });
    }
    // ✅ Send formatted error response
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            details: error,
        }),
    });
};
exports.errorHandler = errorHandler;
/**
 * 404 handler for undefined routes
 */
const notFound = (req, res) => {
    res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
    });
};
exports.notFound = notFound;
/**
 * Utility to wrap async functions and catch errors
 */
const asyncHandler = (fn) => {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
