import { Router } from "express";
import { ClientRevenueReportController } from "../../controllers/client/RevenueReportController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT REVENUE REPORT ROUTES (CLIENT ONLY)
   ============================================================ */

router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientRevenueReportController.getReport
);

export default router;
