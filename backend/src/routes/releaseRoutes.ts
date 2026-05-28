import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import {
  getAllReleases,
  updateReleaseStatus,
  deleteReleaseByAdmin,
} from "../controllers/releaseController";

const router = Router();

/* ================= ADMIN ROUTES ================= */

router.get(
  "/",
  authenticate,
  authorize("admin"),
  getAllReleases
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  updateReleaseStatus
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteReleaseByAdmin
);

export default router;
