import { Router } from "express";
import { ClientApplicationController } from "../../controllers/client/ApplyFormController";

const router = Router();

router.post("/", ClientApplicationController.submit);
router.get("/", ClientApplicationController.list);

export default router;
