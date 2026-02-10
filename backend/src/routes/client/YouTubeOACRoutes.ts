import { Router } from "express";
import { ClientYouTubeOACController } from "../../controllers/client/YouTubeOACController";
import { authenticate, authorize } from "../../middlewares/auth";
import { checkPermission } from "../../middlewares/checkPermission";

const router = Router();

/* ============================================================
   CLIENT YOUTUBE OAC ROUTES (CLIENT ONLY)
   ============================================================ */

// Submit YouTube OAC Request
router.post(
  "/",
  authenticate,
  authorize("client"),
  checkPermission("youtubeOACRequest"),
  ClientYouTubeOACController.submit
);

// Get all OAC requests for logged-in client
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientYouTubeOACController.list
);

export default router;

