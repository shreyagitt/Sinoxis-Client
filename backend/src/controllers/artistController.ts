import { Request, Response } from "express";
import Artist from "../models/Artist";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const artistController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const file = (req as any).file;

    const artist = await Artist.create({
      ...req.body,
      artistImage: file?.path || null,
      artistImageId: file?.filename || null,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: artist,
      message: "Artist created successfully",
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Artist not found" });

    const file = (req as any).file;
    if (file) {
      if (artist.artistImageId) {
        await cloudinary.uploader.destroy(artist.artistImageId);
      }
      req.body.artistImage = file.path;
      req.body.artistImageId = file.filename;
    }

    const updated = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: updated,
      message: "Artist updated successfully",
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Artist not found" });

    if (artist.artistImageId) {
      await cloudinary.uploader.destroy(artist.artistImageId);
    }

    await artist.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Artist deleted successfully",
    });
  }),
};
