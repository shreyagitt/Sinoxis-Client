import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { releaseController } from "../controllers/releaseController";

const router = Router();

router.use(authenticate);

router.get("/", releaseController.list);
router.put("/:id/status", releaseController.updateStatus);
router.delete("/:id", releaseController.delete);

export default router;
