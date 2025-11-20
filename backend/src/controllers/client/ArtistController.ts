import { Request, Response } from "express";
import Artist from "../../models/Artist";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";
import cloudinary from "../../config/cloudinary";

export const ClientArtistController = {
  // --------------------------------------------------
  // LIST ARTISTS (supports search)
  // --------------------------------------------------
  list: asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;

    const filter: any = {};

    if (search) {
      filter.name = { $regex: new RegExp(search as string, "i") };
    }

    const artists = await Artist.find(filter).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: artists,
      message: "Artists fetched successfully",
    });
  }),

  // --------------------------------------------------
  // GET SINGLE ARTIST
  // --------------------------------------------------
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Artist not found",
      });
    }

    res.json({
      success: true,
      data: artist,
      message: "Artist details loaded successfully",
    });
  }),

  // --------------------------------------------------
  // CREATE ARTIST (with Cloudinary)
  // --------------------------------------------------
  create: asyncHandler(async (req: Request, res: Response) => {
    const {
      name,
      genre,
      label,
      followers,
      bio,
      spotify,
      instagram,
      status,
    } = req.body;

    let artistImage = "";
    let artistImageId = "";

    if (req.file) {
      artistImage = req.file.path;                // Cloudinary URL
      artistImageId = req.file.filename || "";    // Cloudinary public_id
    }

    const artist = await Artist.create({
      name,
      genre,
      label,
      followers,
      bio,
      spotify,
      instagram,
      status,
      artistImage,
      artistImageId,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: artist,
      message: "Artist created successfully",
    });
  }),

  // --------------------------------------------------
  // UPDATE ARTIST (with Cloudinary image replacement)
  // --------------------------------------------------
  update: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Artist not found",
      });
    }

    // If user uploaded new image, delete old one
    if (req.file) {
      if (artist.artistImageId) {
        try {
          await cloudinary.uploader.destroy(artist.artistImageId);
        } catch (e) {
          console.log("Cloudinary delete failed", e);
        }
      }

      artist.artistImage = req.file.path;
      artist.artistImageId = req.file.filename;
    }

    // Update other fields
    artist.name = req.body.name ?? artist.name;
    artist.genre = req.body.genre ?? artist.genre;
    artist.label = req.body.label ?? artist.label;
    artist.followers = req.body.followers ?? artist.followers;
    artist.bio = req.body.bio ?? artist.bio;
    artist.spotify = req.body.spotify ?? artist.spotify;
    artist.instagram = req.body.instagram ?? artist.instagram;
    artist.status = req.body.status ?? artist.status;

    await artist.save();

    res.json({
      success: true,
      data: artist,
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
