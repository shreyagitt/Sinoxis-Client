import { Router } from "express";
import { AdminSocialISRCController } from "../controllers/socialISRCController";
import { authenticate} from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, AdminSocialISRCController.list);
router.patch("/:id/status", authenticate, AdminSocialISRCController.updateStatus);
router.delete("/:id", authenticate, AdminSocialISRCController.delete);

export default router;
