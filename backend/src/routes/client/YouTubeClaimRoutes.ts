import { Router } from "express";
import multer from "multer";
import { ClientYouTubeClaimController } from "../../controllers/client/YouTubeClaimController";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", upload.single("screenshot"), ClientYouTubeClaimController.submit);
router.get("/", ClientYouTubeClaimController.list);

export default router;
