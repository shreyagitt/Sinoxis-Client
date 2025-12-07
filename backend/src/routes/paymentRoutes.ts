import { Router } from "express";
import { AdminPaymentController } from "../controllers/paymentController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   ADMIN PAYMENT ROUTES
============================================================ */

// ✅ List all payment requests
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminPaymentController.listAll
);

// ✅ Update request status (Paid / Failed)
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminPaymentController.updateStatus
);

// ✅ Delete payment request
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminPaymentController.deleteRequest
);

export default router;
