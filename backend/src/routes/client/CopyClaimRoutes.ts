import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { ClientCopyrightClaimController } from "../../controllers/client/CopyrightClaimController";

const router = Router();

// Client can submit new claim
router.post(
  "/",
  authenticate,
  authorize("client"), 
  ClientCopyrightClaimController.submit
);

// Client can list only own claims
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientCopyrightClaimController.list
);

export default router;
