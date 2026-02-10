import { Router } from "express";
import multer from "multer";
import { FacebookVideoController } from "../../controllers/client/FacebookVideoController";
import { authenticate, authorize } from "../../middlewares/auth";
import { checkPermission } from "../../middlewares/checkPermission";

const upload = multer({ dest: "uploads/" });
const router = Router();

/* ============================================================
   CLIENT FACEBOOK VIDEO ROUTES (CLIENT ONLY)
   ============================================================ */

// Submit Facebook video proof
router.post(
  "/",
  authenticate,
  authorize("client"),
  checkPermission("facebookClaimRelease"),
  upload.single("screenshotFb"),
  FacebookVideoController.submit
);

// List logged-in client's Facebook submissions
router.get(
  "/",
  authenticate,
  authorize("client"),
  FacebookVideoController.list
);

export default router;

