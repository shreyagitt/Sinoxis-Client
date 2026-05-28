import { Request, Response } from "express";
import Artist from "../../models/Artist";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";
import cloudinary from "../../config/cloudinary";

export const ClientArtistController = {
  // --------------------------------------------------
  // LIST ARTISTS (Search by name)
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
      message: "Artist loaded",
    });
  }),

  // --------------------------------------------------
  // CREATE ARTIST
  // --------------------------------------------------
  create: asyncHandler(async (req: Request, res: Response) => {
    const {
      name,
      mobile,
      email,
      spotify,
      apple,
      youtube,
    } = req.body;

    let avatar = "";
    let avatarId = "";

    // Cloudinary upload
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "artists",
      });
      avatar = upload.secure_url;
      avatarId = upload.public_id;
    }

    const artist = await Artist.create({
      name,
      mobile,
      email,
      spotify,
      apple,
      youtube,
      avatar,
      avatarId,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: artist,
      message: "Artist created successfully",
    });
  }),

  // --------------------------------------------------
  // UPDATE ARTIST
  // --------------------------------------------------
  update: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Artist not found",
      });
    }

    // Replace image if a new file is uploaded
    if (req.file) {
      if (artist.avatarId) {
        try {
          await cloudinary.uploader.destroy(artist.avatarId);
        } catch (err) {
          console.log("Cloudinary deletion failed:", err);
        }
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "artists",
      });

      artist.avatar = upload.secure_url;
      artist.avatarId = upload.public_id;
    }

    // Update fields
    artist.name = req.body.name ?? artist.name;
    artist.mobile = req.body.mobile ?? artist.mobile;
    artist.email = req.body.email ?? artist.email;

    artist.spotify = req.body.spotify ?? artist.spotify;
    artist.apple = req.body.apple ?? artist.apple;
    artist.youtube = req.body.youtube ?? artist.youtube;

    await artist.save();

    res.json({
      success: true,
      data: artist,
      message: "Artist updated successfully",
    });
  }),

  // --------------------------------------------------
  // DELETE ARTIST
  // --------------------------------------------------
  delete: asyncHandler(async (req: Request, res: Response) => {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Artist not found",
      });
    }

    // Remove Cloudinary image if exists
    if (artist.avatarId) {
      try {
        await cloudinary.uploader.destroy(artist.avatarId);
      } catch (err) {
        console.log("Cloudinary deletion failed:", err);
      }
    }

    await artist.deleteOne();

    res.json({
      success: true,
      message: "Artist deleted successfully",
    });
  }),
};
