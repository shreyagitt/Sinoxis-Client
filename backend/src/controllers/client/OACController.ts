import { Request, Response } from "express";
import OACRequest, { ISong } from "../../models/OACRequest";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

interface CreateOACRequestBody {
  ytChannel: string;
  topicChannel?: string;
  artistName: string;
  songs: ISong[];
}

export const ClientOACController = {
  // --------------------------------------------------
  // LIST MY OAC REQUESTS
  // --------------------------------------------------
  listMy: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const requests = await OACRequest.find({ userId })
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: requests,
      message: "OAC requests fetched successfully",
    });
  }),

  // --------------------------------------------------
  // SUBMIT OAC REQUEST
  // --------------------------------------------------
  create: asyncHandler(async (req: Request<{}, {}, CreateOACRequestBody>, res: Response) => {
    const userId = req.user?.userId;

    const { ytChannel, topicChannel, artistName, songs } = req.body;

    if (!songs || songs.length < 3) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "You must add at least 3 songs",
      });
    }

    const request = await OACRequest.create({
      ytChannel,
      topicChannel,
      artistName,
      songs,
      userId,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: request,
      message: "OAC request submitted successfully",
    });
  }),
};
