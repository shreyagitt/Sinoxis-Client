"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientLanguageController = void 0;
const Language_1 = __importDefault(require("../../models/Language"));
const errorHandler_1 = require("../../middlewares/errorHandler");
exports.ClientLanguageController = {
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const languages = await Language_1.default.find({
            isActive: true,
        }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            data: languages,
        });
    }),
};
