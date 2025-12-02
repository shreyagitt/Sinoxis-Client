import { Router } from "express";
import { ClientArtistController } from "../../controllers/client/ArtistController";
import { optionalAuth, authenticate, authorize } from "../../middlewares/auth";
import upload from "../../middlewares/upload";

const router = Router();

/* ============================================================
   PUBLIC CLIENT ROUTES (NO LOGIN REQUIRED)
   ============================================================ */

// List all public artists
router.get("/", optionalAuth, ClientArtistController.list);

// Get a specific artist
router.get("/:id", optionalAuth, ClientArtistController.getOne);


/* ============================================================
   PROTECTED CLIENT ROUTES (LOGIN REQUIRED)
   ============================================================ */

// Create artist
router.post(
  "/",
  authenticate,
  authorize("client"),
  upload.single("artistImage"),
  ClientArtistController.create
);

// Update artist
router.put(
  "/:id",
  authenticate,
  authorize("client"),
  upload.single("artistImage"),
  ClientArtistController.update
);

// Delete artist
router.delete(
  "/:id",
  authenticate,
  authorize("client"),
  ClientArtistController.delete
);

export default router;
