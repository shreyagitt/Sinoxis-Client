"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.listMedia = exports.uploadMedia = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
/**
 * Upload media files to Cloudinary
 */
const uploadMedia = async (files) => {
    const uploadResults = [];
    for (const file of files) {
        const result = await cloudinary_1.default.uploader.upload(file.path, {
            folder: "sinoxis_media",
            resource_type: file.mimetype.startsWith("video") ? "video" : "image",
        });
        uploadResults.push({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
        });
    }
    return uploadResults;
};
exports.uploadMedia = uploadMedia;
/**
 * Fetch all media from Cloudinary
 */
const listMedia = async () => {
    const result = await cloudinary_1.default.api.resources({
        type: "upload",
        prefix: "sinoxis_media/",
        max_results: 30,
    });
    return result.resources.map((r) => ({
        public_id: r.public_id,
        url: r.secure_url,
        format: r.format,
        resource_type: r.resource_type,
    }));
};
exports.listMedia = listMedia;
/**
 * Delete media by public_id
 */
const deleteMedia = async (public_id) => {
    return await cloudinary_1.default.uploader.destroy(public_id, { resource_type: "auto" });
};
exports.deleteMedia = deleteMedia;
