import { Request, Response } from "express";
import Artist from "../models/Artist";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const artistController = {
  
  // ----------------------------------------------------
  // 📌 GET ALL ARTISTS (supports search)
  // ----------------------------------------------------
  list: asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;

    const filter: any = {};

    if (search) {
      filter.name = { $regex: new RegExp(search as string, "i") };
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

    // Upload avatar if file exists
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "artists",
      });

      data.avatar = upload.secure_url;
      data.avatarId = upload.public_id;
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

    // Replace image if new upload exists
    if (req.file) {
      if (artist.avatarId) {
        try {
          await cloudinary.uploader.destroy(artist.avatarId);
        } catch (err) {
          console.log("Cloudinary delete failed:", err);
        }
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
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

    // Delete Cloudinary avatar
    if (artist.avatarId) {
      try {
        await cloudinary.uploader.destroy(artist.avatarId);
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
