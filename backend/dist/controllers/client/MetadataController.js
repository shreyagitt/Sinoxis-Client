"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataController = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const Metadata_1 = __importDefault(require("../../models/Metadata"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.MetadataController = {
    /**
     * 📤 Submit Metadata
     * POST /api/v1/client/metadata
     */
    submit: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const file = req.file;
        let uploadResult;
        if (file) {
            uploadResult = await cloudinary_1.default.uploader.upload(file.path, {
                folder: "sinoxis/metadata_artworks",
            });
            fs_1.default.unlinkSync(file.path); // Remove temp file
        }
        const data = {
            ...req.body,
            artwork: uploadResult?.secure_url || null,
            artworkId: uploadResult?.public_id || null,
        };
        const metadata = await Metadata_1.default.create(data);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Metadata submitted successfully",
            data: metadata,
        });
    }),
    /**
     * 📋 List all metadata submissions
     * GET /api/v1/client/metadata
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const records = await Metadata_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: records,
        });
    }),
};
