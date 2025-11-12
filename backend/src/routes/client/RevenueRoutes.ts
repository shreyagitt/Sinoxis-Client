import { Router } from "express";
import { ClientRevenueController } from "../../controllers/client/RevenueController";

const router = Router();

router.get("/overview", ClientRevenueController.getOverview);

export default router;
