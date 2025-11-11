import { Request, Response } from "express";
import Artist from "../../models/Artist";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientArtistController = {
  // ✅ Get all active artists (with optional search)
  list: asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;

    const filter: any = { status: "Active" };

    if (search) {
      filter.name = { $regex: new RegExp(search as string, "i") };
    }

    const artists = await Artist.find(filter)
      .select("name city label artistImage status") // 👈 Only send needed fields
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: artists,
      message: "Artists fetched successfully",
    });
  }),

  // ✅ Get single artist details
  getOne: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const artist = await Artist.findById(id);

    if (!artist || artist.status !== "Active") {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Artist not found",
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: artist,
      message: "Artist details fetched successfully",
    });
  }),
};

