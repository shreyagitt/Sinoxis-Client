import { Request, Response } from "express";
import Release from "../../models/Release";
import cloudinary from "../../config/cloudinary";
import { asyncHandler } from "../../middlewares/errorHandler";

/* =====================================================
   CREATE OR UPDATE (ONE API FOR ALL PAGES)
   ===================================================== */
export const upsertRelease = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { _id, ...payload } = req.body;

    /* =====================================================
       🔒 NORMALIZATION (MANDATORY FOR multipart/form-data)
       ===================================================== */

    // 1️⃣ Parse tracks if sent as string
    if (typeof payload.tracks === "string") {
      try {
        payload.tracks = JSON.parse(payload.tracks);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid tracks format",
        });
      }
    }

    // 2️⃣ Parse stores if sent as string
    if (typeof payload.stores === "string") {
      try {
        payload.stores = JSON.parse(payload.stores);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid stores format",
        });
      }
    }

    // 3️⃣ Normalize stores → ["spotify", "apple"]
    if (Array.isArray(payload.stores)) {
      payload.stores = payload.stores.map((s: any) =>
        typeof s === "string" ? s : s.platform
      );
    }

    // 4️⃣ Ensure root artist exists
    if (!payload.artist && payload.tracks?.length > 0) {
      payload.artist = payload.tracks[0].primaryArtist;
    }

    /* =====================================================
       COVER HANDLING (multer-storage-cloudinary)
       ===================================================== */

    let cover = payload.cover;
    let coverImageId = payload.coverImageId;

    if (req.file) {
      // delete old cover if exists
      if (coverImageId) {
        await cloudinary.uploader.destroy(coverImageId);
      }

      // multer-storage-cloudinary already uploaded it
      cover = req.file.path;        // secure_url
      coverImageId = req.file.filename; // public_id
    }

    let release;

    /* =====================================================
       UPDATE
       ===================================================== */
    if (_id) {
      const existing = await Release.findOne({
        _id,
        userId: req.user.userId,
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Release not found",
        });
      }

      release = await Release.findByIdAndUpdate(
        _id,
        {
          ...payload,
          ...(cover && { cover }),
          ...(coverImageId && { coverImageId }),

          // preserve lifecycle
          currentStep: payload.currentStep || existing.currentStep,
          status: payload.status || existing.status,
        },
        { new: true }
      );
    }

    /* =====================================================
       CREATE
       ===================================================== */
    else {
      release = await Release.create({
        ...payload,
        userId: req.user.userId,
        cover,
        coverImageId,
        status: "Unfinished",
        currentStep: "release",
      });
    }

    res.status(200).json({
      success: true,
      data: release,
    });
  }
);


/* =====================================================
   GET SINGLE RELEASE
   ===================================================== */
export const getMyReleaseById = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const release = await Release.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!release) {
      return res.status(404).json({
        success: false,
        message: "Release not found",
      });
    }

    res.json({ success: true, data: release });
  }
);

/* =====================================================
   GET ALL MY RELEASES
   ===================================================== */
export const getMyReleases = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const releases = await Release.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: releases });
  }
);

/* =====================================================
   DELETE RELEASE
   ===================================================== */
export const deleteMyRelease = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const doc = await Release.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Release not found",
      });
    }

    if (doc.coverImageId) {
      await cloudinary.uploader.destroy(doc.coverImageId);
    }

    await doc.deleteOne();

    res.json({ success: true, message: "Release deleted" });
  }
);
