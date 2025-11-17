import { Router } from "express";
import { AdminLabelController } from "../controllers/labelController";
import upload from "../middlewares/upload";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Create label
router.post("/", authenticate, upload.single("labelImage"), AdminLabelController.create);

// Update label
router.put("/:id", authenticate, upload.single("labelImage"), AdminLabelController.update);

// Delete label
router.delete("/:id", authenticate, AdminLabelController.delete);

export default router;
