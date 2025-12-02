import { Router } from "express";
import { AdminPaymentController } from "../controllers/paymentController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   PAYMENT MANAGEMENT ROUTES (ADMIN ONLY)
   ============================================================ */

// List all payments
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminPaymentController.list
);

// Update payment status
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  AdminPaymentController.updateStatus
);

// Delete payment
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminPaymentController.delete
);

export default router;
