import { Router } from "express";
import { facebookVideoController } from "../controllers/facebookVideoController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   FACEBOOK VIDEO ROUTES (ADMIN ONLY)
   ============================================================ */

// List all Facebook videos
router.get(
  "/",
  authenticate,
  authorize("admin"),
  facebookVideoController.list
);

// Update video status
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  facebookVideoController.updateStatus
);

// Delete video
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  facebookVideoController.delete
);

export default router;

