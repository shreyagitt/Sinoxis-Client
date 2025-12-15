import { Request, Response } from "express";
import Release from "../../models/Release";
import cloudinary from "../../config/cloudinary";
import { asyncHandler } from "../../middlewares/errorHandler";

/* ✅ CREATE */
export const createRelease = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let coverUrl = "";
  let publicId = "";

  if (req.file) {
    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${req.file.buffer.toString("base64")}`,
      { folder: "releases" }
    );

    coverUrl = upload.secure_url;
    publicId = upload.public_id;
  }

  const release = await Release.create({
    ...req.body,
    userId: req.user.userId, // ✅ FIXED
    cover: coverUrl,
    coverImageId: publicId,
  });

  res.status(201).json({ success: true, data: release });
});

/* ✅ GET MY RELEASES */
export const getMyReleases = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const releases = await Release.find({
    userId: req.user.userId, // ✅ FIXED
  }).sort({ createdAt: -1 });

  res.json({ success: true, data: releases });
});

/* ✅ UPDATE */
export const updateMyRelease = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const old = await Release.findById(req.params.id);
  if (!old) {
    return res.status(404).json({ success: false, message: "Release not found" });
  }

  // ✅ OWNER CHECK (FIXED)
  if (old.userId.toString() !== req.user.userId.toString()) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  let cover = old.cover;
  let coverId = old.coverImageId;

  if (req.file) {
    if (coverId) {
      await cloudinary.uploader.destroy(coverId);
    }

    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${req.file.buffer.toString("base64")}`,
      { folder: "releases" }
    );

    cover = upload.secure_url;
    coverId = upload.public_id;
  }

  const updated = await Release.findByIdAndUpdate(
    req.params.id,
    { ...req.body, cover, coverImageId: coverId },
    { new: true }
  );

  res.json({ success: true, data: updated });
});

/* ✅ DELETE */
export const deleteMyRelease = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const doc = await Release.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: "Release not found" });
  }

  // ✅ OWNER CHECK (FIXED)
  if (doc.userId.toString() !== req.user.userId.toString()) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (doc.coverImageId) {
    await cloudinary.uploader.destroy(doc.coverImageId);
  }

  await doc.deleteOne();

  res.json({ success: true, message: "Release deleted" });
});
