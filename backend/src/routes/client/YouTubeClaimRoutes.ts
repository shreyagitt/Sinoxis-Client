import { Router } from "express";
import multer from "multer";
import { ClientYouTubeClaimController } from "../../controllers/client/YouTubeClaimController";
import { authenticate, authorize } from "../../middlewares/auth";
import { checkPermission } from "../../middlewares/checkPermission";

const upload = multer({ dest: "uploads/" });
const router = Router();

/* ============================================================
   CLIENT YOUTUBE CLAIM ROUTES (CLIENT ONLY)
   ============================================================ */

// Submit a YouTube claim
router.post(
  "/",
  authenticate,
  authorize("client"),
  checkPermission("youtubeClaimRelease"),
  upload.single("screenshot"),
  ClientYouTubeClaimController.submit
);

// Get all claims of the logged-in client
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientYouTubeClaimController.list
);

export default router;

