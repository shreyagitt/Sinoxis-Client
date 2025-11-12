import { Router } from "express";
import { BankController } from "../../controllers/client/BankController";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/", authenticate, BankController.upsert);
router.get("/me", authenticate, BankController.getMyDetails);

export default router;
