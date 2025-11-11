import { Request, Response } from "express";
import Release from "../../models/Release";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";

export const ClientReleaseController = {

  // List only my releases
  mine: asyncHandler(async (req: any, res: Response) => {
    const releases = await Release.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, data: releases });
  }),

  // Create release (artist)
  create: asyncHandler(async (req: any, res: Response) => {
    const data: any = {
      userId: req.user.userId,
      title: req.body.title,
      subtitle: req.body.subtitle,
    };

    if (req.files?.coverImage?.[0]) {
      data.coverImage = req.files.coverImage[0].path;
      data.coverImageId = req.files.coverImage[0].filename;
    }

    if (req.files?.audioFile?.[0]) {
      data.audioFile = req.files.audioFile[0].path;
      data.audioFileId = req.files.audioFile[0].filename;
    }

    const release = await Release.create(data);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: release, message: "Release submitted for approval" });
  }),

  // View single release
  getOne: asyncHandler(async (req: any, res: Response) => {
    const release = await Release.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!release) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Release not found" });
    res.status(HTTP_STATUS.OK).json({ success: true, data: release });
  }),

  // Artist Edit (only when status != Approved)
  update: asyncHandler(async (req: any, res: Response) => {
    const release = await Release.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!release) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Release not found" });
    if (release.status === "Approved") return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: "Cannot edit approved release" });

    release.title = req.body.title || release.title;
    release.subtitle = req.body.subtitle || release.subtitle;

    if (req.files?.coverImage?.[0]) {
      release.coverImage = req.files.coverImage[0].path;
      release.coverImageId = req.files.coverImage[0].filename;
    }

    if (req.files?.audioFile?.[0]) {
      release.audioFile = req.files.audioFile[0].path;
      release.audioFileId = req.files.audioFile[0].filename;
    }

    await release.save();
    res.status(HTTP_STATUS.OK).json({ success: true, data: release, message: "Release updated" });
  }),
};
