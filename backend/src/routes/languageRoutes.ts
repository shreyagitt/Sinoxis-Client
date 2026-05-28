import { Router } from "express";
import { AdminLanguageController } from "../controllers/languageController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, authorize("admin"), AdminLanguageController.list);

router.post("/", authenticate, authorize("admin"), AdminLanguageController.create);

router.patch("/:id", authenticate, authorize("admin"), AdminLanguageController.update);

router.patch("/:id/toggle", authenticate, authorize("admin"), AdminLanguageController.toggleActive);

router.delete("/:id", authenticate, authorize("admin"), AdminLanguageController.delete);

export default router;