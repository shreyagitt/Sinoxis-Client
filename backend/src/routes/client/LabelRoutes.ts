import { Router } from "express";
import { ClientLabelController } from "../../controllers/client/LabelController";
import { optionalAuth } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT LABEL ROUTES (PUBLIC)
   ============================================================ */

// Public — list all active labels
router.get("/", optionalAuth, ClientLabelController.list);

// Public — get single label details
router.get("/:id", optionalAuth, ClientLabelController.getOne);

export default router;
