import { Router } from "express";
import { ClientSocialISRCController } from "../../controllers/client/SocialISRCController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT SOCIAL ISRC ROUTES (CLIENT ONLY)
   ============================================================ */

// Submit new ISRC for a release
router.post(
  "/",
  authenticate,
  authorize("client"),
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
