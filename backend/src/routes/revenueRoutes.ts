import { Router } from "express";
import { AdminRevenueController } from "../controllers/revenueController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   REVENUE ROUTES (ADMIN ONLY)
   ============================================================ */

// Create or update revenue
router.post(
  "/",
  authenticate,
  authorize("admin"),
  AdminRevenueController.upsert
);

// List revenue
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminRevenueController.list
);

// Delete all revenue
router.delete(
  "/",
  authenticate,
  authorize("admin"),
  AdminRevenueController.deleteAll
);

export default router;

