import { Router } from "express";
import { ClientArtistController } from "../../controllers/client/ArtistController";
import { optionalAuth } from "../../middlewares/auth";

const router = Router();

// List all active artists
router.get("/", optionalAuth, ClientArtistController.list);

// ✅ Get single artist detail
router.get("/:id", optionalAuth, ClientArtistController.getOne);

export default router;
