import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { releaseController } from "../controllers/releaseController";
import upload from "../middlewares/upload";

const router = Router();

/* ============================================================
   ADMIN RELEASE MANAGEMENT ROUTES
   ============================================================ */

// Create a release (admin optional)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("coverImage"),   // Only cover upload supported
  releaseController.create
);

// Update a release (admin full access)
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("coverImage"),   // Only cover upload supported
  releaseController.update
);

// List all releases
router.get(
  "/",
  authenticate,
  authorize("admin"),
  releaseController.list
);

// Update release status
router.put(
  "/:id/status",
  authenticate,
  authorize("admin"),
  releaseController.updateStatus
);

// Delete release
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  releaseController.delete
);

export default router;
