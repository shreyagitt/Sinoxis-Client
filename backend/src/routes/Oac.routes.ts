import { Router } from "express";
import { AdminOACController } from "../controllers/OACAdminController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// Admin: list all requests
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminOACController.list
);

// Admin: update status
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminOACController.updateStatus
);

export default router;
