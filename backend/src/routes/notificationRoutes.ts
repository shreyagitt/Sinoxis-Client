// routes/notificationRoutes.ts
import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import {
  sendNotification,
  getAllNotifications,
  deleteNotification,
} from "../controllers/notificationController";

const router = Router();

router.post("/send", authenticate, authorize("admin"), sendNotification);
router.get("/", authenticate, authorize("admin"), getAllNotifications);
router.delete("/:id", authenticate, authorize("admin"), deleteNotification);

export default router;
