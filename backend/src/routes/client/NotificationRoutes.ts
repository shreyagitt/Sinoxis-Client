import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import {
  getMyNotifications,
  deleteNotification,
  markAllAsRead,
} from "../../controllers/client/NotificationController";

const router = Router();

// ✅ GET NOTIFICATIONS
router.get("/", authenticate, authorize("client"), getMyNotifications);

// ✅ DELETE SINGLE
router.delete("/:id", authenticate, authorize("client"), deleteNotification);

// ✅ MARK ALL READ
router.patch("/mark-all-read", authenticate, authorize("client"), markAllAsRead);

export default router;
