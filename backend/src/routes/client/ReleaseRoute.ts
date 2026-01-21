import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import upload from "../../middlewares/upload";
import {
  upsertRelease,
  getMyReleaseById,
  getMyReleases,
  deleteMyRelease,
} from "../../controllers/client/ReleaseController";

const router = Router();

/* =====================================================
   CREATE OR UPDATE RELEASE (ONE API)
   Used by: Release / Tracks / Stores / Submission pages
   ===================================================== */
router.post(
  "/",
  authenticate,
  authorize("client"),
  upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]),

  upsertRelease
);

/* =====================================================
   GET SINGLE RELEASE (EDIT / VIEW / PREFILL)
   ===================================================== */
router.get(
  "/:id",
  authenticate,
  authorize("client"),
  getMyReleaseById
);

/* =====================================================
   GET ALL MY RELEASES (DASHBOARD)
   ===================================================== */
router.get(
  "/",
  authenticate,
  authorize("client"),
  getMyReleases
);

/* =====================================================
   DELETE RELEASE
   ===================================================== */
router.delete(
  "/:id",
  authenticate,
  authorize("client"),
  deleteMyRelease
);

export default router;
