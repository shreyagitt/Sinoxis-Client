import { Router } from "express";
import { AdminNotificationController } from "../controllers/notificationController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate,  AdminNotificationController.create);
router.get("/", authenticate,  AdminNotificationController.list);
router.delete("/:id", authenticate,  AdminNotificationController.delete);

export default router;
