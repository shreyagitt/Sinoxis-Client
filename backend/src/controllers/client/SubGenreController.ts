import { Request, Response } from "express";
import SubGenre from "../../models/SubGenre";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientSubGenreController = {

  /**
   * 📋 List SubGenres by Genre
   */
  listByGenre: asyncHandler(async (req: Request, res: Response) => {

    const { genreId } = req.params;

    const data = await SubGenre.find({
      genreId,
      isActive: true
    })
    .select("_id name")
    .sort({ name: 1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    });

  }),

  /**
   * 📋 List All SubGenres
   */
  listAll: asyncHandler(async (_req: Request, res: Response) => {

    const data = await SubGenre.find({ isActive: true })
      .populate("genreId", "name")
      .sort({ name: 1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data
    });

  }),

};