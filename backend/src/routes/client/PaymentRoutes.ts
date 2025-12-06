import { Router } from "express";
import { ClientPaymentController } from "../../controllers/client/PaymentController";
import { authenticate, authorize } from "../../middlewares/auth.js";

const router = Router();

/* ============================================================
   CLIENT PAYMENT ROUTES
============================================================ */

// Create payment request
router.post(
  "/",
  authenticate,
  authorize("client"),
  ClientPaymentController.create
);

// List user's own payment requests
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientPaymentController.list
);

export default router;

