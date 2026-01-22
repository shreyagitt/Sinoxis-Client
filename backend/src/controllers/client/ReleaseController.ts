import { Request, Response } from "express";
import Release from "../../models/Release";
import cloudinary from "../../config/cloudinary";
import { asyncHandler } from "../../middlewares/errorHandler";

/* =====================================================
   CREATE OR UPDATE RELEASE
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
       NORMALIZATION
       ===================================================== */

    // Parse tracks JSON
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

    /* =====================================================
   🔥 HARD FILTER: REMOVE INVALID TRACKS
   ===================================================== */

if (Array.isArray(payload.tracks)) {
  payload.tracks = payload.tracks
    .map((t: any) => ({
      ...t,
      trackTitle: typeof t.trackTitle === "string" ? t.trackTitle.trim() : "",
      primaryArtist:
        typeof t.primaryArtist === "string"
          ? t.primaryArtist.trim()
          : "",
    }))
    .filter(
      (t: any) =>
        t.trackTitle.length > 0 &&
        t.primaryArtist.length > 0
    );
}


    // Parse stores JSON
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

    // Normalize stores → ["spotify", "apple"]
    if (Array.isArray(payload.stores)) {
      payload.stores = payload.stores.map((s: any) =>
        typeof s === "string" ? s : s.platform
      );
    }

    // Ensure root artist exists
    if (!payload.artist && payload.tracks?.length > 0) {
      payload.artist = payload.tracks[0].primaryArtist;
    }

    /* =====================================================
       COVER + AUDIO HANDLING
       ===================================================== */

    let cover = payload.cover || null;
    let coverImageId = payload.coverImageId || null;

    const files = req.files as {
      cover?: Express.Multer.File[];
      audio?: Express.Multer.File[];
    };

    const coverFile = files?.cover?.[0];
    const audioFiles = files?.audio || [];

    /* ───── COVER ───── */
    if (coverFile) {
      if (coverImageId) {
        await cloudinary.uploader.destroy(coverImageId);
      }

      cover = coverFile.path;
      coverImageId = coverFile.filename;
    }

    /* ───── AUDIO (MULTI-TRACK SAFE + EDIT SAFE) ───── */

if (Array.isArray(payload.tracks)) {
  payload.tracks = await Promise.all(
    payload.tracks.map(async (track: any, index: number) => {
      const incomingAudio = audioFiles[index];

      let audioUrl = track.audioUrl || null;
      let audioFileId = track.audioFileId || null;

      if (incomingAudio) {
        if (audioFileId) {
          await cloudinary.uploader.destroy(audioFileId, {
            resource_type: "raw",
          });
        }

        audioUrl = incomingAudio.path;
        audioFileId = incomingAudio.filename;
      }

      return {
        ...track,
        audioUrl,
        audioFileId,
      };
    })
  );
}



    /* =====================================================
       UPDATE OR CREATE
       ===================================================== */

    let release;

    if (_id) {
      // 🔄 UPDATE FLOW
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

          // Preserve lifecycle fields
          currentStep: payload.currentStep || existing.currentStep,
          status: payload.status || existing.status,
        },
        { new: true }
      );
    } else {
      // 🆕 CREATE FLOW
      release = await Release.create({
        ...payload,
        userId: req.user.userId,
        ...(cover && { cover }),
        ...(coverImageId && { coverImageId }),
        currentStep: payload.currentStep || "release",
        status: payload.status || "Draft",
      });
    }

    return res.status(200).json({
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
