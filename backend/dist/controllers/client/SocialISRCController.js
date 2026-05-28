"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSocialISRCController = void 0;
const SocialISRC_1 = __importDefault(require("../../models/SocialISRC"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientSocialISRCController = {
    /**
     * 📤 Submit Social ISRC Form
     * POST /api/v1/client/social-isrc
     */
    submit: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const submission = await SocialISRC_1.default.create(req.body);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Social Profile & ISRC details submitted successfully.",
            data: submission,
        });
    }),
    /**
     * 📋 List All Submissions (for client)
     * GET /api/v1/client/social-isrc
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const submissions = await SocialISRC_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: submissions,
        });
    }),
};
