import { Router } from "express";
import { AdminRevenueController } from "../controllers/revenueController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, AdminRevenueController.upsert);
router.get("/", authenticate,  AdminRevenueController.list);
router.delete("/", authenticate,  AdminRevenueController.deleteAll);

export default router;
