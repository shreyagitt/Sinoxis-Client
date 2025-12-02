import { Router } from "express";
import { AdminSocialISRCController } from "../controllers/socialISRCController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   SOCIAL ISRC ROUTES (ADMIN ONLY)
   ============================================================ */

// List all ISRC data
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminSocialISRCController.list
);

// Update ISRC status
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  AdminSocialISRCController.updateStatus
);

// Delete ISRC record
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminSocialISRCController.delete
);

export default router;

