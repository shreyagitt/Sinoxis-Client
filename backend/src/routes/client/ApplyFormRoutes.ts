import { Router } from "express";
import { ClientApplicationController } from "../../controllers/client/ApplyFormController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

// PUBLIC — Anyone can submit form
router.post("/", ClientApplicationController.submit);

// PROTECTED — Only logged-in clients can view their own applications
router.get(
  "/",
  authenticate,
  authorize("client"),
  
  ClientApplicationController.list
);

export default router;

