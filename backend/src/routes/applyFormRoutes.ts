import { Router } from "express";
import { AdminApplicationController } from "../controllers/applyFormController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, AdminApplicationController.list);
// Create new applicant
router.post("/",  authenticate,AdminApplicationController.create);
router.patch("/:id/status", authenticate, AdminApplicationController.updateStatus);
router.delete("/:id", authenticate, AdminApplicationController.delete);

export default router;
