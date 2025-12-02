import { Router } from "express";
import { AdminRevenueReportController } from "../controllers/revenueReportController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   REVENUE REPORT ROUTES (ADMIN ONLY)
   ============================================================ */

// Create / Update revenue report
router.post(
  "/",
  authenticate,
  authorize("admin"),
  AdminRevenueReportController.upsert
);

// List revenue reports
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminRevenueReportController.list
);

// Delete all revenue reports
router.delete(
  "/",
  authenticate,
  authorize("admin"),
  AdminRevenueReportController.deleteAll
);

export default router;

