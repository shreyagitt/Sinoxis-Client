import { Router } from "express";
import { artistController } from "../controllers/artistController";
import upload from "../middlewares/upload";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   ARTIST ROUTES (ADMIN ONLY)
   ============================================================ */

// Get all artists (search)
router.get("/", authenticate, authorize("admin"), artistController.list);

// Get single artist
router.get("/:id", authenticate, authorize("admin"), artistController.getOne);

// Create artist
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("avatar"),   // UPDATED FIELD NAME
  artistController.create
);

// Update artist
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("avatar"),   // UPDATED FIELD NAME
  artistController.update
);

// Delete artist
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  artistController.delete
);

export default router;
