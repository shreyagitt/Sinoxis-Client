"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientYouTubeClaimController = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const YouTubeClaim_1 = __importDefault(require("../../models/YouTubeClaim"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientYouTubeClaimController = {
    /**
     * 📤 Submit YouTube Claim
     * POST /api/v1/client/youtube-claim
     */
    submit: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const file = req.file;
        let uploadResult;
        if (file) {
            uploadResult = await cloudinary_1.default.uploader.upload(file.path, {
                folder: "sinoxis/youtube_claims",
            });
            fs_1.default.unlinkSync(file.path); // delete temp file
        }
        const data = {
            ...req.body,
            screenshot: uploadResult?.secure_url || null,
            screenshotId: uploadResult?.public_id || null,
        };
        const claim = await YouTubeClaim_1.default.create(data);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "YouTube claim submitted successfully.",
            data: claim,
        });
    }),
    /**
     * 📋 List All Claims (Client View)
     * GET /api/v1/client/youtube-claim
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const claims = await YouTubeClaim_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: claims,
        });
    }),
};
