import { Router } from "express";
import { AdminPaymentController } from "../controllers/paymentController";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

/* ============================================================
   ADMIN PAYMENT ROUTES
============================================================ */

// List all requests
router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminPaymentController.list
);

// Update withdraw status
router.put(
  "/:id/status",
  authenticate,
  authorize("admin"),
  AdminPaymentController.updateStatus
);

// Delete request
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminPaymentController.delete
);

export default router;
