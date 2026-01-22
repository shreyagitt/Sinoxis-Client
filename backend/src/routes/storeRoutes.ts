import { Router } from "express";
import multer from "multer";
import { AdminStoreController } from "../controllers/storeController";
import { authenticate, authorize } from "../middlewares/auth";

const upload = multer({ dest: "uploads/" });
const router = Router();

/* ============================================================
   STORE ROUTES (ADMIN ONLY)
   ============================================================ */

router.get(
  "/",
  authenticate,
  authorize("admin"),
  AdminStoreController.list
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("icon"),
  AdminStoreController.create
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("icon"),
  AdminStoreController.update
);

router.patch(
  "/:id/toggle",
  authenticate,
  authorize("admin"),
  AdminStoreController.toggleActive
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminStoreController.delete
);

export default router;
