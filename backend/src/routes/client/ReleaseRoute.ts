import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import upload from "../../middlewares/upload";
import { ClientReleaseController } from "../../controllers/client/ReleaseController";

const router = Router();

/* ============================================================
   CLIENT RELEASE ROUTES (CLIENT ONLY)
   ============================================================ */

// Get all releases of logged-in client
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientReleaseController.mine
);

// Get a single release owned by the client
router.get(
  "/:id",
  authenticate,
  authorize("client"),
  ClientReleaseController.getOne
);

// Create new release
router.post(
  "/",
  authenticate,
  authorize("client"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 }
  ]),
  ClientReleaseController.create
);

// Update existing release
router.put(
  "/:id",
  authenticate,
  authorize("client"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 }
  ]),
  ClientReleaseController.update
);

export default router;
