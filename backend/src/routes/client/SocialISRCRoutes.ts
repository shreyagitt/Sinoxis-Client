import { Router } from "express";
import { ClientSocialISRCController } from "../../controllers/client/SocialISRCController";
import { authenticate, authorize } from "../../middlewares/auth";
import { checkPermission } from "../../middlewares/checkPermission";

const router = Router();

/* ============================================================
   CLIENT SOCIAL ISRC ROUTES (CLIENT ONLY)
   ============================================================ */

// Submit new ISRC for a release
router.post(
  "/",
  authenticate,
  authorize("client"),
  checkPermission("socialMediaLinks"),
  ClientSocialISRCController.submit
);

// Get all ISRC submissions of the logged-in client
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientSocialISRCController.list
);

export default router;
