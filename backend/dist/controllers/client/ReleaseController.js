"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMyRelease = exports.getMyReleases = exports.getMyReleaseById = exports.upsertRelease = void 0;
const Release_1 = __importDefault(require("../../models/Release"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const errorHandler_1 = require("../../middlewares/errorHandler");
/* =====================================================
   CREATE OR UPDATE RELEASE
   ===================================================== */
exports.upsertRelease = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
        }
        catch {
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
            .map((t) => ({
            ...t,
            trackTitle: typeof t.trackTitle === "string" ? t.trackTitle.trim() : "",
            primaryArtist: typeof t.primaryArtist === "string"
                ? t.primaryArtist.trim()
                : "",
        }))
            .filter((t) => t.trackTitle.length > 0 &&
            t.primaryArtist.length > 0);
    }
    // Parse stores JSON
    if (typeof payload.stores === "string") {
        try {
            payload.stores = JSON.parse(payload.stores);
        }
        catch {
            return res.status(400).json({
                success: false,
                message: "Invalid stores format",
            });
        }
    }
    // Normalize stores → ["spotify", "apple"]
    if (Array.isArray(payload.stores)) {
        payload.stores = payload.stores.map((s) => typeof s === "string" ? s : s.platform);
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
    const files = req.files;
    const coverFile = files?.cover?.[0];
    const audioFiles = files?.audio || [];
    /* ───── COVER ───── */
    if (coverFile) {
        if (coverImageId) {
            await cloudinary_1.default.uploader.destroy(coverImageId);
        }
        cover = coverFile.path;
        coverImageId = coverFile.filename;
    }
    /* ───── AUDIO (MULTI-TRACK SAFE + EDIT SAFE) ───── */
    if (Array.isArray(payload.tracks)) {
        payload.tracks = await Promise.all(payload.tracks.map(async (track, index) => {
            const incomingAudio = audioFiles[index];
            let audioUrl = track.audioUrl || null;
            let audioFileId = track.audioFileId || null;
            if (incomingAudio) {
                if (audioFileId) {
                    await cloudinary_1.default.uploader.destroy(audioFileId, {
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
        }));
    }
    /* =====================================================
       UPDATE OR CREATE
       ===================================================== */
    let release;
    if (_id) {
        // 🔄 UPDATE FLOW
        const existing = await Release_1.default.findOne({
            _id,
            userId: req.user.userId,
        });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Release not found",
            });
        }
        release = await Release_1.default.findByIdAndUpdate(_id, {
            ...payload,
            ...(cover && { cover }),
            ...(coverImageId && { coverImageId }),
            // Preserve lifecycle fields
            currentStep: payload.currentStep || existing.currentStep,
            status: payload.status || existing.status,
        }, { new: true });
    }
    else {
        // 🆕 CREATE FLOW
        release = await Release_1.default.create({
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
});
/* =====================================================
   GET SINGLE RELEASE
   ===================================================== */
exports.getMyReleaseById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const release = await Release_1.default.findOne({
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
});
/* =====================================================
   GET ALL MY RELEASES
   ===================================================== */
exports.getMyReleases = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const releases = await Release_1.default.find({
        userId: req.user.userId,
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: releases });
});
/* =====================================================
   DELETE RELEASE
   ===================================================== */
exports.deleteMyRelease = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user?.userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const doc = await Release_1.default.findOne({
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
        await cloudinary_1.default.uploader.destroy(doc.coverImageId);
    }
    await doc.deleteOne();
    res.json({ success: true, message: "Release deleted" });
});
