import { Router } from "express";
import { AdminLabelController } from "../controllers/labelController";
import upload from "../middlewares/upload";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   LABEL MANAGEMENT ROUTES (ADMIN ONLY)
   ============================================================ */

// Create label
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("labelImage"),
  AdminLabelController.create
);

// Update label
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("labelImage"),
  AdminLabelController.update
);

// Delete label
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminLabelController.delete
);

export default router;
