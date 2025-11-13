import { Router } from "express";
import { ClientNotificationController } from "../../controllers/client/NotificationController";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.get("/", authenticate, ClientNotificationController.getAll);
router.patch("/mark-all", authenticate, ClientNotificationController.markAllAsRead);
router.delete("/:id", authenticate, ClientNotificationController.deleteOne);

export default router;
