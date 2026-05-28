"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSubGenreController = void 0;
const SubGenre_1 = __importDefault(require("../models/SubGenre"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminSubGenreController = {
    /**
     * 📋 List SubGenres of a Genre
     */
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const data = await SubGenre_1.default.find({
            genreId: req.params.genreId,
        }).sort({ name: 1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data,
        });
    }),
    /**
     * ➕ Create SubGenre
     */
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const sub = await SubGenre_1.default.create({
            name: req.body.name,
            genreId: req.params.genreId,
        });
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "SubGenre created",
            data: sub,
        });
    }),
    /**
     * ✏ Update SubGenre
     */
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const sub = await SubGenre_1.default.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "SubGenre updated",
            data: sub,
        });
    }),
    /**
     * 🔄 Toggle Active
     */
    toggleActive: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const sub = await SubGenre_1.default.findById(req.params.id);
        if (!sub) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "SubGenre not found",
            });
        }
        sub.isActive = !sub.isActive;
        await sub.save();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Status updated",
            data: sub,
        });
    }),
    /**
     * ❌ Delete
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        await SubGenre_1.default.findByIdAndDelete(req.params.id);
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "SubGenre deleted",
        });
    }),
};
