"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSubGenreController = void 0;
const SubGenre_1 = __importDefault(require("../../models/SubGenre"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientSubGenreController = {
    /**
     * 📋 List SubGenres by Genre
     */
    listByGenre: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { genreId } = req.params;
        const data = await SubGenre_1.default.find({
            genreId,
            isActive: true
        })
            .select("_id name")
            .sort({ name: 1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data
        });
    }),
    /**
     * 📋 List All SubGenres
     */
    listAll: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await SubGenre_1.default.find({ isActive: true })
            .populate("genreId", "name")
            .sort({ name: 1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data
        });
    }),
};
