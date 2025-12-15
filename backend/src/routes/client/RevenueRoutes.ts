import { Router } from "express";
import { ClientRevenueController } from "../../controllers/client/RevenueController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientRevenueController.getMyAnalytics
);

router.get(
  "/export/csv",
  authenticate,
  authorize("client"),
  ClientRevenueController.exportMyAnalyticsCSV
);

export default router;
