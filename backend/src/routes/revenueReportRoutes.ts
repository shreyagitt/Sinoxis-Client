import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { AdminRevenueController } from "../controllers/revenueReportController";

const router = Router();

router.get("/", authenticate, authorize("admin"), AdminRevenueController.list);

router.put("/:id/status", authenticate, authorize("admin"), AdminRevenueController.updateWithdrawStatus);

router.delete("/:id", authenticate, authorize("admin"), AdminRevenueController.deleteTransaction);

export default router;
