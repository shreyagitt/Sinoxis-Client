import { Router } from "express";
import { AdminPaymentController } from "../controllers/paymentController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate,  AdminPaymentController.list);
router.patch("/:id/status", authenticate,  AdminPaymentController.updateStatus);
router.delete("/:id", authenticate,  AdminPaymentController.delete);

export default router;
