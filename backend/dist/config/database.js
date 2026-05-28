"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL; // using your env variable
if (!MONGO_URL) {
    throw new Error('❌ MONGO_URL is not defined in environment variables');
}
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(MONGO_URL);
        console.log(`✅ MongoDB Connected`);
        // Handle connection errors
        mongoose_1.default.connection.on('error', (err) => {
            console.error('⚠️ MongoDB connection error:', err);
        });
        // Handle disconnections
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            console.log('🛑 MongoDB connection closed due to app termination');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('✅ MongoDB disconnected');
    }
    catch (error) {
        console.error('⚠️ Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDB = disconnectDB;
