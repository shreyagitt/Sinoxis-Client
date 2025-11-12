import { Router } from "express";
import { AdminRevenueReportController } from "../controllers/revenueReportController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate,  AdminRevenueReportController.upsert);
router.get("/", authenticate,  AdminRevenueReportController.list);
router.delete("/", authenticate,  AdminRevenueReportController.deleteAll);

export default router;
