import { Router } from "express";
import { ClientLanguageController } from "../../controllers/client/LanguageController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientLanguageController.list
);

export default router;