import { Router } from "express";
import { artistController } from "../controllers/artistController";
import upload from "../middlewares/upload";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   ARTIST ROUTES (ADMIN ONLY)
   ============================================================ */

// Get all artists (search + filter)
router.get("/", authenticate, authorize("admin"), artistController.list);

// Get artist by ID
router.get("/:id", authenticate, authorize("admin"), artistController.getOne);

// Create new artist
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("artistImage"),
  artistController.create
);

// Update artist
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("artistImage"),
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
