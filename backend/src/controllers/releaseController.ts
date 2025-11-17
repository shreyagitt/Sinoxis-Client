import { Request, Response } from "express";
import Release from "../models/Release";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const releaseController = {
  // =====================================================
  // CREATE RELEASE
  // =====================================================
  create: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as any;

    const cover = files?.coverImage?.[0];
    const audio = files?.audioFile?.[0];

    const release = await Release.create({
      userId: (req as any).user._id,
      title: req.body.title,
      subtitle: req.body.subtitle,
      remarks: req.body.remarks,

      coverImage: cover?.path || null,
      coverImageId: cover?.filename || null,

      audioFile: audio?.path || null,
      audioFileId: audio?.filename || null,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Release created successfully",
      data: release,
    });
  }),

  // =====================================================
  // UPDATE RELEASE
  // =====================================================
  update: asyncHandler(async (req: Request, res: Response) => {
    const release = await Release.findById(req.params.id);
    if (!release) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: "Release not found" });
    }

    const files = req.files as any;
    const cover = files?.coverImage?.[0];
    const audio = files?.audioFile?.[0];

    // ---- Replace Cover Image ----
    if (cover) {
      if (release.coverImageId) {
        await cloudinary.uploader.destroy(release.coverImageId);
      }
      req.body.coverImage = cover.path;
      req.body.coverImageId = cover.filename;
    }

    // ---- Replace Audio ----
    if (audio) {
      if (release.audioFileId) {
        await cloudinary.uploader.destroy(release.audioFileId);
      }
      req.body.audioFile = audio.path;
      req.body.audioFileId = audio.filename;
    }

    const updated = await Release.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Release updated successfully",
      data: updated,
    });
  }),

  // =====================================================
  // LIST RELEASES
  // =====================================================
  list: asyncHandler(async (req: Request, res: Response) => {
    const releases = await Release.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: releases,
    });
  }),

  // =====================================================
  // UPDATE STATUS
  // =====================================================
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status, remarks } = req.body;

    const updated = await Release.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Status updated",
      data: updated,
    });
  }),

  // =====================================================
  // DELETE RELEASE
  // =====================================================
  delete: asyncHandler(async (req: Request, res: Response) => {
    const release = await Release.findById(req.params.id);
    if (!release) return;

    // Remove files from Cloudinary
    if (release.coverImageId) {
      await cloudinary.uploader.destroy(release.coverImageId);
    }

    if (release.audioFileId) {
      await cloudinary.uploader.destroy(release.audioFileId);
    }

    await release.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Release deleted",
    });
  }),
};

