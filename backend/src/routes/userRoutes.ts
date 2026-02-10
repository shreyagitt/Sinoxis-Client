import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { userController } from "../controllers/userController";

const router = Router();

/* ============================================================
   ADMIN USER ROUTES
   ============================================================ */
// ✅ CREATE CLIENT USER (ADD USER)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  userController.create
);

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

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.update
);

router.put(
  "/:id/permissions",
  authenticate,
  authorize("admin"),
  userController.updatePermissions
);


// Delete user
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.delete
);


router.patch(
  "/:id/block",
  authenticate,
  authorize("admin"),
  userController.block
);

export default router;
