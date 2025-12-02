import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { releaseController } from "../controllers/releaseController";
import upload from "../middlewares/upload";

const router = Router();

/* ============================================================
   RELEASE MANAGEMENT ROUTES (ADMIN ONLY)
   ============================================================ */

// CREATE RELEASE
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 }
  ]),
  releaseController.create
);

// UPDATE RELEASE
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 }
  ]),
  releaseController.update
);

// LIST RELEASES
router.get(
  "/",
  authenticate,
  authorize("admin"),
  releaseController.list
);

// UPDATE RELEASE STATUS
router.put(
  "/:id/status",
  authenticate,
  authorize("admin"),
  releaseController.updateStatus
);

// DELETE RELEASE
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  releaseController.delete
);

export default router;
