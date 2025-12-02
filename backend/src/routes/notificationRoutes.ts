import { Router } from "express";
import { AdminNotificationController } from "../controllers/notificationController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   NOTIFICATION MANAGEMENT ROUTES (ADMIN ONLY)
   ============================================================ */

// Create Notification
router.post(
  "/",
  authenticate,
  authorize("admin"),
  AdminNotificationController.create
);

// List Notifications
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminNotificationController.list
);

// Delete Notification
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminNotificationController.delete
);

export default router;
