import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { ClientCopyrightClaimController } from "../../controllers/client/CopyrightClaimController";
import { checkPermission } from "../../middlewares/checkPermission";

const router = Router();

// Client can submit new claim
router.post(
  "/",
  authenticate,
  authorize("client"), 
  checkPermission("copyrightClaim"),
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
