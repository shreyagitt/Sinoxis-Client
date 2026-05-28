import { Router } from "express";
import { AdminYouTubeOACController } from "../controllers/youTubeOACController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   YOUTUBE OAC ROUTES (ADMIN ONLY)
   ============================================================ */

// List all OAC requests
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminYouTubeOACController.list
);

// Update OAC status
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  AdminYouTubeOACController.updateStatus
);

// Delete OAC request
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminYouTubeOACController.delete
);

export default router;

