import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import {
  getAllReleases,
  updateReleaseStatus,
} from "../controllers/releaseController";

const router = Router();

// ✅ GET ALL RELEASES (ADMIN ONLY)
router.get(
  "/",
  authenticate,
  authorize("admin"),
  getAllReleases
);

// ✅ UPDATE RELEASE STATUS (ADMIN ONLY)
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  updateReleaseStatus
);

export default router;

