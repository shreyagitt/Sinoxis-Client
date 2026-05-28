import { Router } from "express";
import { AdminApplicationController } from "../controllers/applyFormController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// ======================================================
// ADMIN ROUTES (Protected by RBAC)
// ======================================================

// Get all applications (ADMIN ONLY)
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminApplicationController.list
);

// Create new applicant (ADMIN ONLY)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  AdminApplicationController.create
);

// Update applicant status (ADMIN ONLY)
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  AdminApplicationController.updateStatus
);

// Delete applicant (ADMIN ONLY)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminApplicationController.delete
);

export default router;
