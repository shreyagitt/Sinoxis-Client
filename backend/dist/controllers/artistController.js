"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistController = void 0;
const Artist_1 = __importDefault(require("../models/Artist"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.artistController = {
    // ----------------------------------------------------
    // 📌 GET ALL ARTISTS (supports search)
    // ----------------------------------------------------
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { search } = req.query;
        const filter = {};
        if (search) {
            filter.name = { $regex: new RegExp(search, "i") };
        }
        const artists = await Artist_1.default.find(filter).sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            count: artists.length,
            data: artists,
        });
    }),
    // ----------------------------------------------------
    // 📌 GET SINGLE ARTIST
    // ----------------------------------------------------
    getOne: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const artist = await Artist_1.default.findById(req.params.id);
        if (!artist) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Artist not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: artist,
        });
    }),
    // ----------------------------------------------------
    // 📌 CREATE ARTIST (Cloudinary supported)
    // ----------------------------------------------------
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const data = req.body;
        // Upload avatar if file exists
        if (req.file) {
            const upload = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "artists",
            });
            data.avatar = upload.secure_url;
            data.avatarId = upload.public_id;
        }
        const artist = await Artist_1.default.create(data);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Artist created successfully",
            data: artist,
        });
    }),
    // ----------------------------------------------------
    // 📌 UPDATE ARTIST (Safe update + Cloudinary replacement)
    // ----------------------------------------------------
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const artist = await Artist_1.default.findById(req.params.id);
        if (!artist) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Artist not found",
            });
        }
        // Replace image if new upload exists
        if (req.file) {
            if (artist.avatarId) {
                try {
                    await cloudinary_1.default.uploader.destroy(artist.avatarId);
                }
                catch (err) {
                    console.log("Cloudinary delete failed:", err);
                }
            }
            const upload = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "artists",
            });
            artist.avatar = upload.secure_url;
            artist.avatarId = upload.public_id;
        }
        // Allowed fields based on your new UI
        const allowed = [
            "name",
            "mobile",
            "email",
            "spotify",
            "apple",
            "youtube",
        ];
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) {
                // @ts-ignore
                artist[field] = req.body[field];
            }
        });
        await artist.save();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Artist updated successfully",
            data: artist,
        });
    }),
    // ----------------------------------------------------
    // 📌 DELETE ARTIST
    // ----------------------------------------------------
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const artist = await Artist_1.default.findById(req.params.id);
        if (!artist) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Artist not found",
            });
        }
        // Delete Cloudinary avatar
        if (artist.avatarId) {
            try {
                await cloudinary_1.default.uploader.destroy(artist.avatarId);
            }
            catch (err) {
                console.log("Cloudinary delete failed:", err);
            }
        }
        await artist.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Artist deleted successfully",
        });
    }),
};
