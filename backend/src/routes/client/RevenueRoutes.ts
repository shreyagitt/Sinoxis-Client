import { Router } from "express";
import { ClientRevenueController } from "../../controllers/client/RevenueController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT REVENUE OVERVIEW (CLIENT ONLY)
   ============================================================ */

router.get(
  "/overview",
  authenticate,
  authorize("client"),
  ClientRevenueController.getOverview
);

export default router;
