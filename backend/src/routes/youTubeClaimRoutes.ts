import { Router } from "express";
import { AdminYouTubeClaimController } from "../controllers/youTubeClaimController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate,  AdminYouTubeClaimController.list);
router.patch("/:id/status", authenticate,  AdminYouTubeClaimController.updateStatus);
router.delete("/:id", authenticate,  AdminYouTubeClaimController.delete);

export default router;
