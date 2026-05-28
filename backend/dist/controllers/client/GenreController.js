"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGenreController = void 0;
const Genre_1 = __importDefault(require("../../models/Genre"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientGenreController = {
    /**
     * 📋 List Active Genres with SubGenres
     * GET /api/v1/client/genres
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await Genre_1.default.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: "subgenres",
                    localField: "_id",
                    foreignField: "genreId",
                    as: "subGenres"
                }
            },
            {
                $addFields: {
                    subGenres: {
                        $filter: {
                            input: "$subGenres",
                            as: "sg",
                            cond: { $eq: ["$$sg.isActive", true] }
                        }
                    }
                }
            },
            { $sort: { name: 1 } }
        ]);
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data
        });
    }),
};
