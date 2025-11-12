import { Router } from "express";
import { AdminYouTubeOACController } from "../controllers/youTubeOACController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, AdminYouTubeOACController.list);
router.patch("/:id/status", authenticate,  AdminYouTubeOACController.updateStatus);
router.delete("/:id", authenticate,  AdminYouTubeOACController.delete);

export default router;
