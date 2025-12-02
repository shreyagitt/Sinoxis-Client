import { Router } from "express";
import { AdminYouTubeClaimController } from "../controllers/youTubeClaimController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   YOUTUBE CLAIM ROUTES (ADMIN ONLY)
   ============================================================ */

// List all claims
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminYouTubeClaimController.list
);

// Update claim status
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  AdminYouTubeClaimController.updateStatus
);

// Delete claim
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminYouTubeClaimController.delete
);

export default router;

