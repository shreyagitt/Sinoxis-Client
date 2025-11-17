import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { releaseController } from "../controllers/releaseController";
import upload from "../middlewares/upload"; // Multer for files

const router = Router();

router.use(authenticate);

// CREATE RELEASE
router.post("/", upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "audioFile", maxCount: 1 }
]), releaseController.create);

// UPDATE RELEASE
router.put("/:id", upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "audioFile", maxCount: 1 }
]), releaseController.update);

router.get("/", releaseController.list);
router.put("/:id/status", releaseController.updateStatus);
router.delete("/:id", releaseController.delete);

export default router;
