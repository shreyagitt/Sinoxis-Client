import { Request, Response } from "express";
import Artist from "../models/Artist";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const artistController = {

  // ----------------------------------------------------
  // 📌 GET ALL ARTISTS (supports search + status filter)
  // ----------------------------------------------------
  list: asyncHandler(async (req: Request, res: Response) => {
    const { search, status } = req.query;

    const filter: any = {};

    if (search) {
      filter.name = { $regex: new RegExp(search as string, "i") };
    }

    if (status) {
      filter.status = status;
    }

    const artists = await Artist.find(filter).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: artists.length,
      data: artists,
    });
  }),

  // ----------------------------------------------------
  // 📌 GET SINGLE ARTIST
  // ----------------------------------------------------
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Artist not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: artist,
    });
  }),

  // ----------------------------------------------------
  // 📌 CREATE ARTIST (Cloudinary supported)
  // ----------------------------------------------------
  create: asyncHandler(async (req: Request, res: Response) => {
    const data: any = req.body;

    if (req.file) {
      data.artistImage = req.file.path;
      data.artistImageId =
        (req.file as any).filename || (req.file as any).public_id;
    }

    const artist = await Artist.create(data);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Artist created successfully",
      data: artist,
    });
  }),

  // ----------------------------------------------------
  // 📌 UPDATE ARTIST (Safe update + Cloudinary replacement)
  // ----------------------------------------------------
  update: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Artist not found",
      });
    }

    // If new image uploaded, delete old one first
    if (req.file) {
      if (artist.artistImageId) {
        try {
          await cloudinary.uploader.destroy(artist.artistImageId);
        } catch (err) {
          console.log("Cloudinary delete failed:", err);
        }
      }

      artist.artistImage = req.file.path;
      artist.artistImageId =
        (req.file as any).filename || (req.file as any).public_id;
    }

    // Allowed fields to update
    const allowed = [
      "name",
      "genre",
      "label",
      "followers",
      "bio",
      "spotify",
      "instagram",
      "status",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        // @ts-ignore
        artist[field] = req.body[field];
      }
    });

    await artist.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Artist updated successfully",
      data: artist,
    });
  }),

  // ----------------------------------------------------
  // 📌 DELETE ARTIST
  // ----------------------------------------------------
  delete: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Artist not found",
      });
    }

    if (artist.artistImageId) {
      try {
        await cloudinary.uploader.destroy(artist.artistImageId);
      } catch (err) {
        console.log("Cloudinary delete failed:", err);
      }
    }

    await artist.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Artist deleted successfully",
    });
  }),
};
