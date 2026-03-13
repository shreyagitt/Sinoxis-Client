"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientYouTubeOACController = void 0;
const YouTubeOAC_1 = __importDefault(require("../../models/YouTubeOAC"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientYouTubeOACController = {
    /**
     * 📨 Submit OAC Request
     * POST /api/v1/client/youtube-oac
     */
    submit: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const newRequest = await YouTubeOAC_1.default.create(req.body);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "YouTube OAC request submitted successfully.",
            data: newRequest,
        });
    }),
    /**
     * 📋 Get All OAC Requests (Client)
     * GET /api/v1/client/youtube-oac
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const requests = await YouTubeOAC_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: requests,
        });
    }),
};
