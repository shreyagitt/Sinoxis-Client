import { Router } from "express";
import { BankController } from "../../controllers/client/BankController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT BANK DETAILS ROUTES (CLIENT ONLY)
   ============================================================ */

// Add or update client bank details
router.post(
  "/",
  authenticate,
  authorize("client"),
  BankController.upsert
);

// Get logged-in client's bank details
router.get(
  "/me",
  authenticate,
  authorize("client"),
  BankController.getMyDetails
);

export default router;

