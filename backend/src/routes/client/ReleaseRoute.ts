import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import upload from "../../middlewares/upload";
import {
  createRelease,
  getMyReleases,
  updateMyRelease,
  deleteMyRelease,
} from "../../controllers/client/ReleaseController";

const router = Router();

// ✅ CREATE RELEASE (CLIENT)
router.post(
  "/",
  authenticate,
  authorize("client"),
  upload.single("cover"),
  createRelease
);

// ✅ GET MY RELEASES (CLIENT)
router.get(
  "/",
  authenticate,
  authorize("client"),
  getMyReleases
);

// ✅ UPDATE MY RELEASE (CLIENT)
router.put(
  "/:id",
  authenticate,
  authorize("client"),
  upload.single("cover"),
  updateMyRelease
);

// ✅ DELETE MY RELEASE (CLIENT)
router.delete(
  "/:id",
  authenticate,
  authorize("client"),
  deleteMyRelease
);

export default router;
