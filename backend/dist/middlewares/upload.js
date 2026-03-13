"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Configure Cloudinary storage for multer
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => {
        let resourceType = "video";
        if (file.fieldname === "cover") {
            resourceType = "image";
        }
        return {
            folder: "sinoxis_media",
            resource_type: resourceType,
            public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        };
    },
});
// Multer setup
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/mov",
            "video/avi",
            // 🔥 AUDIO
            "audio/mpeg",
            "audio/wav",
            "audio/x-wav",
            "audio/ogg",
            "audio/flac",
            "application/pdf",
            "application/zip",
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(Object.assign(new Error("Invalid file type"), {
                code: "LIMIT_FILE_TYPE",
            }), false);
        }
        cb(null, true);
    },
});
// Export configured uploader
exports.default = upload;
