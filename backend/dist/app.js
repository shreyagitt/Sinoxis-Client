"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
// Load environment variables
const app = (0, express_1.default)();
// =======================
// 🔹 Middleware Setup
// =======================
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// =======================
// 🔹 MongoDB Connection
// =======================
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
// =======================
// 🔹 Routes
// =======================
app.use(routes_1.default);
app.get("/", (req, res) => res.send("☁️ Cloudinary Media API Running"));
// =======================
// 🔹 Health Check
// =======================
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Sinoxis Admin API is running',
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || 'v1'
    });
});
exports.default = app;
