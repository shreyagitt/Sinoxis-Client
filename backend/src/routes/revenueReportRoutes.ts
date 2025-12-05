import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { RevenueAdminController } from "../controllers/revenueReportController";

const router = Router();

router.get(
  "/summary",
  authenticate,
  authorize("admin"),
  RevenueAdminController.getSummary
);

router.post(
  "/add",
  authenticate,
  authorize("admin"),
  RevenueAdminController.addIncome
);

router.get(
  "/withdraw-requests",
  authenticate,
  authorize("admin"),
  RevenueAdminController.listWithdraws
);

router.patch(
  "/withdraw/:id",
  authenticate,
  authorize("admin"),
  RevenueAdminController.updateWithdrawStatus
);

router.delete(
  "/transaction/:id",
  authenticate,
  authorize("admin"),
  RevenueAdminController.deleteTransaction
);

export default router;
