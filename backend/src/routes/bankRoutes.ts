import { Router } from "express";
import { bankController } from "../controllers/bankController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   BANK MANAGEMENT ROUTES (ADMIN ONLY)
   ============================================================ */

// Get all bank entries
router.get(
  "/",
  authenticate,
  authorize("admin", "superadmin"),

  bankController.list
);

// Get single bank entry
router.get(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),

  bankController.getOne
);

// Verify bank record (admin only)
router.put(
  "/:id/verify",
  authenticate,
  authorize("admin", "superadmin"),

  bankController.verify
);

// Delete bank record
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "superadmin"),

  bankController.delete
);

export default router;

