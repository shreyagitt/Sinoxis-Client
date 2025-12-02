import { Router } from "express";
import multer from "multer";
import { FacebookVideoController } from "../../controllers/client/FacebookVideoController";
import { authenticate, authorize } from "../../middlewares/auth";

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

