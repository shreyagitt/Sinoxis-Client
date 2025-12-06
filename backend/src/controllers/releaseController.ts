import { Request, Response } from "express";
import Release from "../models/Release";
import cloudinary from "../config/cloudinary";
import { asyncHandler } from "../middlewares/errorHandler";
import { HTTP_STATUS } from "../config/constants";

export const releaseController = {

  // =====================================================
  // CREATE RELEASE (Admin rarely uses this)
  // =====================================================
  create: asyncHandler(async (req: Request, res: Response) => {
    const file = (req as any).file;

    const data: any = {
      userId: (req as any).user._id,

      // FRONTEND MATCHING FIELDS
      title: req.body.title,
      artist: req.body.artist,
      label: req.body.label,
      isrc: req.body.isrc,
      upc: req.body.upc,

      status: req.body.status || "Pending",
    };

    /* -------------------------------
       Handle Cloudinary Cover Upload
    -------------------------------- */
    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "sinoxis/releases",
        resource_type: "image",
      });

      data.cover = uploaded.secure_url;
      data.coverImageId = uploaded.public_id;
    }

    const release = await Release.create(data);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Release created successfully",
      data: release,
    });
  }),

  // =====================================================
  // UPDATE RELEASE (ADMIN FULL EDIT ACCESS)
  // =====================================================
  update: asyncHandler(async (req: Request, res: Response) => {
    const release = await Release.findById(req.params.id);
    if (!release) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Release not found",
      });
    }

    const file = (req as any).file;

    /* -------------------------------
       Update Frontend Fields Only
    -------------------------------- */
    release.title = req.body.title ?? release.title;
    release.artist = req.body.artist ?? release.artist;
    release.label = req.body.label ?? release.label;
    release.isrc = req.body.isrc ?? release.isrc;
    release.upc = req.body.upc ?? release.upc;
    release.status = req.body.status ?? release.status;

    /* -------------------------------
       Update Cover Image via Cloudinary
    -------------------------------- */
    if (file) {
      // Remove old image from Cloudinary
      if (release.coverImageId) {
        try {
          await cloudinary.uploader.destroy(release.coverImageId);
        } catch (err) {
          console.warn("Failed to delete old image:", err);
        }
      }

      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "sinoxis/releases",
        resource_type: "image",
      });

      release.cover = uploaded.secure_url;
      release.coverImageId = uploaded.public_id;
    }

    await release.save();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Release updated successfully",
      data: release,
    });
  }),

  // =====================================================
  // LIST RELEASES (ADMIN FULL ACCESS)
  // =====================================================
  list: asyncHandler(async (req: Request, res: Response) => {
    const releases = await Release.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: releases,
    });
  }),

  // =====================================================
  // UPDATE STATUS (Admin Approval / Reject / Inactive)
  // =====================================================
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;

    const updated = await Release.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    return res.status(HTTP_STATUS.OK).json({
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
    if (!release) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Release not found",
      });
    }

    // Delete cover from Cloudinary
    if (release.coverImageId) {
      try {
        await cloudinary.uploader.destroy(release.coverImageId);
      } catch (err) {
        console.warn("Cloudinary delete error:", err);
      }
    }

    await release.deleteOne();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Release deleted",
    });
  }),
};
