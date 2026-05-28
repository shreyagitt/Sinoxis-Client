import { Router } from "express";
import { metadataController } from "../controllers/metadataController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   METADATA ROUTES (ADMIN ONLY)
   ============================================================ */

// List metadata entries
router.get(
  "/",
  authenticate,
  authorize("admin"),
  metadataController.list
);

// Update metadata status
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  metadataController.updateStatus
);

// Delete metadata
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  metadataController.delete
);

export default router;

