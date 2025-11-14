import { Router } from "express";
import { AdminApplicationController } from "../controllers/applyFormController";

const router = Router();

router.get("/", AdminApplicationController.list);
// Create new applicant
router.post("/", AdminApplicationController.create);
router.patch("/:id/status", AdminApplicationController.updateStatus);
router.delete("/:id", AdminApplicationController.delete);

export default router;
