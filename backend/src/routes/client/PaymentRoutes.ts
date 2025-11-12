import { Router } from "express";
import { ClientPaymentController } from "../../controllers/client/PaymentController";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/", authenticate, ClientPaymentController.create);
router.get("/", authenticate, ClientPaymentController.list);

export default router;
