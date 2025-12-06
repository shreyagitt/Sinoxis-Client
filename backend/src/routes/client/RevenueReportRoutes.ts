import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { ClientRevenueController } from "../../controllers/client/RevenueReportController";

const router = Router();

router.get("/", authenticate, authorize("client"), ClientRevenueController.list);

router.post("/withdraw", authenticate, authorize("client"), ClientRevenueController.withdraw);

export default router;


