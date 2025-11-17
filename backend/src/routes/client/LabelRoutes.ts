import { Router } from "express";
import { ClientLabelController } from "../../controllers/client/LabelController";
import { optionalAuth } from "../../middlewares/auth";

const router = Router();

// List all active labels
router.get("/", optionalAuth, ClientLabelController.list);

// Get single label
router.get("/:id", optionalAuth, ClientLabelController.getOne);

export default router;
