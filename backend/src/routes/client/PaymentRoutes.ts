import { Router } from "express";
import { ClientPaymentController } from "../../controllers/client/PaymentController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT PAYMENT ROUTES (CLIENT ONLY)
   ============================================================ */

// Create a new payment entry (client)
router.post(
  "/",
  authenticate,
  authorize("client"),
  ClientPaymentController.create
);

// List payments of the logged-in client
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientPaymentController.list
);

export default router;
