import { Request, Response } from "express";
import Genre from "../models/Genre";
import SubGenre from "../models/SubGenre";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const AdminGenreController = {

  /**
   * 📋 List Genres
   * GET /api/v1/genre
   */
  list: asyncHandler(async (_req: Request, res: Response) => {

    const genres = await Genre.find().sort({ createdAt: -1 });

    const data = await Promise.all(
      genres.map(async (genre) => {

        const count = await SubGenre.countDocuments({
          genreId: genre._id,
        });

        return {
          ...genre.toObject(),
          subGenreCount: count,
        };
      })
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });

  }),

  /**
   * ➕ Create Genre
   */
  create: asyncHandler(async (req: Request, res: Response) => {

    const file = req.file;
    let upload;

    if (file) {
      upload = await cloudinary.uploader.upload(file.path, {
        folder: "sinoxis/genres",
      });

      fs.unlinkSync(file.path);
    }

    const genre = await Genre.create({
      name: req.body.name,
      icon: upload?.secure_url,
      iconId: upload?.public_id,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Genre created successfully",
      data: genre,
    });

  }),

  /**
   * ✏ Update Genre
   */
  update: asyncHandler(async (req: Request, res: Response) => {

    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Genre not found",
      });
    }

    if (req.file) {

      await cloudinary.uploader.destroy(genre.iconId);

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "sinoxis/genres",
      });

      fs.unlinkSync(req.file.path);

      genre.icon = upload.secure_url;
      genre.iconId = upload.public_id;
    }

    genre.name = req.body.name || genre.name;

    await genre.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Genre updated",
      data: genre,
    });

  }),

  /**
   * 🔄 Toggle Genre Active
   */
  toggleActive: asyncHandler(async (req: Request, res: Response) => {

    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Genre not found",
      });
    }

    genre.isActive = !genre.isActive;
    await genre.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Genre ${genre.isActive ? "activated" : "deactivated"}`,
      data: genre,
    });

  }),

  /**
   * ❌ Delete Genre
   */
  delete: asyncHandler(async (req: Request, res: Response) => {

    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Genre not found",
      });
    }

    await cloudinary.uploader.destroy(genre.iconId);

    await SubGenre.deleteMany({ genreId: genre._id });

    await genre.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Genre deleted successfully",
    });

  }),
};