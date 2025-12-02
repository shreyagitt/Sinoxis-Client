import { Router } from "express";
import { ClientNotificationController } from "../../controllers/client/NotificationController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT NOTIFICATION ROUTES (CLIENT ONLY)
   ============================================================ */

// Get all notifications for the logged-in client
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientNotificationController.getAll
);

// Mark all as read
router.patch(
  "/mark-all",
  authenticate,
  authorize("client"),
  ClientNotificationController.markAllAsRead
);

// Delete a notification
router.delete(
  "/:id",
  authenticate,
  authorize("client"),
  ClientNotificationController.deleteOne
);

export default router;
