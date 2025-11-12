import { Router } from "express";
import { ClientRevenueReportController } from "../../controllers/client/RevenueReportController";

const router = Router();

router.get("/", ClientRevenueReportController.getReport);

export default router;
