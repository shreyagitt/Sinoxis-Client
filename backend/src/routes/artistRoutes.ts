import { Router } from "express";
import { artistController } from "../controllers/artistController";
import upload from "../middlewares/upload";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate,  upload.single("artistImage"), artistController.create);
router.put("/:id", authenticate,  upload.single("artistImage"), artistController.update);
router.delete("/:id", authenticate,  artistController.delete);

export default router;
