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

// Create a new release
router.post(
  "/",
  authenticate,
  authorize("client"),
  upload.single("coverImage"),   // File upload for cover
  ClientReleaseController.create
);

// Update release
router.put(
  "/:id",
  authenticate,
  authorize("client"),
  upload.single("coverImage"),   // File upload for updated cover
  ClientReleaseController.update
);

export default router;
