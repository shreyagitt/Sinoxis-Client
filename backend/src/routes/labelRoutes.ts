import { Router } from "express";
import { AdminLabelController } from "../controllers/labelController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, authorize("admin"), AdminLabelController.list);
router.get("/:id", authenticate, authorize("admin"), AdminLabelController.getOne);

router.put("/:id/status", authenticate, authorize("admin"), AdminLabelController.updateStatus);

router.delete("/:id", authenticate, authorize("admin"), AdminLabelController.delete);

export default router;
