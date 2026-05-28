"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGenreController = void 0;
const Genre_1 = __importDefault(require("../models/Genre"));
const SubGenre_1 = __importDefault(require("../models/SubGenre"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminGenreController = {
    /**
     * 📋 List Genres
     * GET /api/v1/genre
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const genres = await Genre_1.default.find().sort({ createdAt: -1 });
        const data = await Promise.all(genres.map(async (genre) => {
            const count = await SubGenre_1.default.countDocuments({
                genreId: genre._id,
            });
            return {
                ...genre.toObject(),
                subGenreCount: count,
            };
        }));
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data,
        });
    }),
    /**
     * ➕ Create Genre
     */
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const file = req.file;
        let upload;
        if (file) {
            upload = await cloudinary_1.default.uploader.upload(file.path, {
                folder: "sinoxis/genres",
            });
            fs_1.default.unlinkSync(file.path);
        }
        const genre = await Genre_1.default.create({
            name: req.body.name,
            icon: upload?.secure_url,
            iconId: upload?.public_id,
        });
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Genre created successfully",
            data: genre,
        });
    }),
    /**
     * ✏ Update Genre
     */
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const genre = await Genre_1.default.findById(req.params.id);
        if (!genre) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Genre not found",
            });
        }
        if (req.file) {
            await cloudinary_1.default.uploader.destroy(genre.iconId);
            const upload = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "sinoxis/genres",
            });
            fs_1.default.unlinkSync(req.file.path);
            genre.icon = upload.secure_url;
            genre.iconId = upload.public_id;
        }
        genre.name = req.body.name || genre.name;
        await genre.save();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Genre updated",
            data: genre,
        });
    }),
    /**
     * 🔄 Toggle Genre Active
     */
    toggleActive: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const genre = await Genre_1.default.findById(req.params.id);
        if (!genre) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Genre not found",
            });
        }
        genre.isActive = !genre.isActive;
        await genre.save();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: `Genre ${genre.isActive ? "activated" : "deactivated"}`,
            data: genre,
        });
    }),
    /**
     * ❌ Delete Genre
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const genre = await Genre_1.default.findById(req.params.id);
        if (!genre) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Genre not found",
            });
        }
        await cloudinary_1.default.uploader.destroy(genre.iconId);
        await SubGenre_1.default.deleteMany({ genreId: genre._id });
        await genre.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Genre deleted successfully",
        });
    }),
};
