"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const constants_1 = require("./config/constants");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
// ---------------- SECURITY ----------------
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
// ---------------- CORS ----------------
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",")
    .map(o => o.trim().replace(/\/+$/, ''));
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS Not Allowed: " + origin));
        }
    },
    credentials: process.env.CORS_CREDENTIALS === "true",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.options("*", (0, cors_1.default)());
// ---------------- STATIC FILES ----------------
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// ---------------- RATE LIMIT ----------------
app.use((0, express_rate_limit_1.default)({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 mins default
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 req per window
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
}));
// ---------------- BODY PARSING ----------------
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ---------------- COMPRESSION ----------------
app.use((0, compression_1.default)());
// ---------------- LOGGING ----------------
if (constants_1.APP_CONFIG.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.use((req, res, next) => {
    if (constants_1.APP_CONFIG.NODE_ENV === 'development') {
        console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    }
    next();
});
// ---------------- ROUTES ----------------
app.use('/', routes_1.default);
// 404 handler
app.use(errorHandler_1.notFound);
// Global error handler
app.use(errorHandler_1.errorHandler);
// ---------------- START SERVER ----------------
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app.listen(constants_1.APP_CONFIG.PORT, () => {
            console.log(`🚀 ${constants_1.APP_CONFIG.NAME} running on port ${constants_1.APP_CONFIG.PORT}`);
            console.log(`📊 Environment: ${constants_1.APP_CONFIG.NODE_ENV}`);
            console.log(`🔗 API Version: ${constants_1.APP_CONFIG.VERSION}`);
            console.log(`🌐 Health Check: http://localhost:${constants_1.APP_CONFIG.PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle crashes
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
// Start server
startServer();
exports.default = app;
