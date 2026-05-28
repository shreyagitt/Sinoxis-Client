import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { AdminCopyrightClaimController } from "../controllers/copyrightClaimController";

const router = Router();

// Admin: View all claims
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminCopyrightClaimController.list
);

// Admin: Update claim status
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  AdminCopyrightClaimController.updateStatus
);

// Admin: Delete claim
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminCopyrightClaimController.delete
);

export default router;
