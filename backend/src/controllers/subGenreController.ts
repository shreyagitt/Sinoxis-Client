import { Request, Response } from "express";
import SubGenre from "../models/SubGenre";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminSubGenreController = {

  /**
   * 📋 List SubGenres of a Genre
   */
  list: asyncHandler(async (req: Request, res: Response) => {

    const data = await SubGenre.find({
      genreId: req.params.genreId,
    }).sort({ name: 1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });

  }),

  /**
   * ➕ Create SubGenre
   */
  create: asyncHandler(async (req: Request, res: Response) => {

    const sub = await SubGenre.create({
      name: req.body.name,
      genreId: req.params.genreId,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "SubGenre created",
      data: sub,
    });

  }),

  /**
   * ✏ Update SubGenre
   */
  update: asyncHandler(async (req: Request, res: Response) => {

    const sub = await SubGenre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "SubGenre updated",
      data: sub,
    });

  }),

  /**
   * 🔄 Toggle Active
   */
  toggleActive: asyncHandler(async (req: Request, res: Response) => {

    const sub = await SubGenre.findById(req.params.id);

    if (!sub) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "SubGenre not found",
      });
    }

    sub.isActive = !sub.isActive;
    await sub.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Status updated",
      data: sub,
    });

  }),

  /**
   * ❌ Delete
   */
  delete: asyncHandler(async (req: Request, res: Response) => {

    await SubGenre.findByIdAndDelete(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "SubGenre deleted",
    });

  }),
};