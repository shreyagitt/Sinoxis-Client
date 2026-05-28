import { Router } from "express";
import { AdminRevenueController } from "../controllers/revenueController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  AdminRevenueController.createAnalytics
);

router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminRevenueController.getAllAnalytics
);

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminRevenueController.getSingleAnalytics
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminRevenueController.updateAnalytics
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminRevenueController.deleteAnalytics
);

export default router;
