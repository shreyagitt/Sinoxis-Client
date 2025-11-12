import { Router } from "express";
import { facebookVideoController } from "../controllers/facebookVideoController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// Only admin can access these endpoints
router.get("/", authenticate, facebookVideoController.list);
router.patch("/:id/status", authenticate, facebookVideoController.updateStatus);
router.delete("/:id", authenticate, facebookVideoController.delete);

export default router;
