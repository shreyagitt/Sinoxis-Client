import { Router } from "express";
import { ClientArtistController } from "../../controllers/client/ArtistController";
import { optionalAuth } from "../../middlewares/auth";
import upload from "../../middlewares/upload"; // Cloudinary Multer Storage

const router = Router();

// List all artists (Active + search)
router.get("/", optionalAuth, ClientArtistController.list);

// Get single artist
router.get("/:id", optionalAuth, ClientArtistController.getOne);

// Create artist
router.post(
  "/",
  optionalAuth,
  upload.single("artistImage"), // Cloudinary
  ClientArtistController.create
);

// Update artist
router.put(
  "/:id",
  optionalAuth,
  upload.single("artistImage"), // Cloudinary
  ClientArtistController.update
);

router.delete("/:id", optionalAuth,  ClientArtistController.delete);

export default router;
