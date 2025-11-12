import { Router } from "express";
import { bankController } from "../controllers/bankController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, bankController.list);
router.get("/:id", authenticate, bankController.getOne);
router.put("/:id/verify", authenticate, bankController.verify);
router.delete("/:id", authenticate, bankController.delete);

export default router;
