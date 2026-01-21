import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { userController } from "../controllers/userController";

const router = Router();

/* ============================================================
   ADMIN USER ROUTES
   ============================================================ */

// Get all users (for dashboard + table)
router.get(
  "/",
  authenticate,
  authorize("admin"),
  userController.list
);

// Get single user
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.getOne
);

// Delete user
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.delete
);

export default router;
