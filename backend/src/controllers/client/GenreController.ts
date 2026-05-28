import { Request, Response } from "express";
import Genre from "../../models/Genre";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientGenreController = {

  /**
   * 📋 List Active Genres with SubGenres
   * GET /api/v1/client/genres
   */
  list: asyncHandler(async (_req: Request, res: Response) => {

    const data = await Genre.aggregate([
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

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    });

  }),

};