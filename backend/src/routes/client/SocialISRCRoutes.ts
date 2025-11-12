import { Router } from "express";
import { ClientSocialISRCController } from "../../controllers/client/SocialISRCController";

const router = Router();

router.post("/", ClientSocialISRCController.submit);
router.get("/", ClientSocialISRCController.list);

export default router;
