"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookVideoController = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const FacebookVideo_1 = __importDefault(require("../../models/FacebookVideo"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.FacebookVideoController = {
    /**
     * 📨 Submit new Facebook Video claim
     * POST /api/v1/client/facebook-video
     */
    submit: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const file = req.file;
        let uploadResult;
        if (file) {
            uploadResult = await cloudinary_1.default.uploader.upload(file.path, {
                folder: "sinoxis/facebook_claims",
            });
            fs_1.default.unlinkSync(file.path); // delete temp file
        }
        const data = {
            ...req.body,
            screenshotFb: uploadResult?.secure_url || null,
            screenshotFbId: uploadResult?.public_id || null,
        };
        const claim = await FacebookVideo_1.default.create(data);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Facebook video claim submitted successfully.",
            data: claim,
        });
    }),
    /**
     * 📋 List all claims (for user view)
     * GET /api/v1/client/facebook-video
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const claims = await FacebookVideo_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: claims,
        });
    }),
};
