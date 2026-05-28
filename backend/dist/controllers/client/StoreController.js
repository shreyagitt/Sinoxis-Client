"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientStoreController = void 0;
const Store_1 = __importDefault(require("../../models/Store"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientStoreController = {
    /**
     * 📋 List Active Stores (Client View)
     * GET /api/v1/client/stores
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await Store_1.default.find({ isActive: true }).sort({ name: 1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data,
        });
    }),
};
