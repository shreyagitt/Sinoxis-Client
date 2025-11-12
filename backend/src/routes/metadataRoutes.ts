import { Router } from "express";
import { metadataController } from "../controllers/metadataController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, metadataController.list);
router.patch("/:id/status", authenticate,metadataController.updateStatus);
router.delete("/:id", authenticate, metadataController.delete);

export default router;
