import { Request, Response } from "express";
import Release from "../../models/Release";
import { asyncHandler } from "../../middlewares/errorHandler";
import { HTTP_STATUS } from "../../config/constants";
import cloudinary from "../../config/cloudinary";

export const ClientReleaseController = {

  /* =========================================================
     GET MY RELEASES
  ========================================================== */
  mine: asyncHandler(async (req: any, res: Response) => {
    const releases = await Release.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: releases,
    });
  }),

  /* =========================================================
     CREATE RELEASE
  ========================================================== */
  create: asyncHandler(async (req: any, res: Response) => {
    const data: any = {
      userId: req.user.userId,

      title: req.body.title,
      artist: req.body.artist,
      label: req.body.label,
      isrc: req.body.isrc,
      upc: req.body.upc,

      status: req.body.status || "Pending",
    };

    /* ============= COVER IMAGE HANDLING ============= */

    // Base64 upload
    if (req.body.cover && !req.files?.coverImage?.[0]) {
      const uploaded = await cloudinary.uploader.upload(req.body.cover, {
        folder: "sinoxis/releases",
        resource_type: "image"
      });

      data.cover = uploaded.secure_url;
      data.coverImageId = uploaded.public_id;
    }

    // File upload (multer)
    if (req.files?.coverImage?.[0]) {
      const uploaded = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: "sinoxis/releases",
          resource_type: "image"
        }
      );

      data.cover = uploaded.secure_url;
      data.coverImageId = uploaded.public_id;
    }

    const release = await Release.create(data);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: release,
      message: "Release created successfully",
    });
  }),

  /* =========================================================
     GET ONE RELEASE
  ========================================================== */
  getOne: asyncHandler(async (req: any, res: Response) => {
    const release = await Release.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!release) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: "Release not found" });
    }

    res.status(HTTP_STATUS.OK).json({ success: true, data: release });
  }),

  /* =========================================================
     UPDATE RELEASE
  ========================================================== */
  update: asyncHandler(async (req: any, res: Response) => {
    const release = await Release.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!release) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: "Release not found" });
    }

    if (release.status === "Approved") {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ success: false, message: "Cannot edit an approved release" });
    }

    /* ============= UPDATE SIMPLE FIELDS ============= */
    release.title = req.body.title ?? release.title;
    release.artist = req.body.artist ?? release.artist;
    release.label = req.body.label ?? release.label;
    release.isrc = req.body.isrc ?? release.isrc;
    release.upc = req.body.upc ?? release.upc;
    release.status = req.body.status ?? release.status;

    /* ============= COVER UPDATE ============= */

    const incomingBase64 = req.body.cover && !req.files?.coverImage?.[0];
    const incomingFile = req.files?.coverImage?.[0];

    if (incomingBase64 || incomingFile) {
      // Delete old Cloudinary image
      if (release.coverImageId) {
        try {
          await cloudinary.uploader.destroy(release.coverImageId);
        } catch (err) {
          console.warn("Cloudinary delete error:", err);
        }
      }

      let uploaded;

      if (incomingBase64) {
        uploaded = await cloudinary.uploader.upload(req.body.cover, {
          folder: "sinoxis/releases",
          resource_type: "image"
        });
      } else {
        uploaded = await cloudinary.uploader.upload(incomingFile.path, {
          folder: "sinoxis/releases",
          resource_type: "image"
        });
      }

      release.cover = uploaded.secure_url;
      release.coverImageId = uploaded.public_id;
    }

    await release.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: release,
      message: "Release updated",
    });
  }),
};
