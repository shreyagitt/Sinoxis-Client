import { Router } from "express";
import { ClientYouTubeOACController } from "../../controllers/client/YouTubeOACController";

const router = Router();

router.post("/", ClientYouTubeOACController.submit);
router.get("/", ClientYouTubeOACController.list);

export default router;
