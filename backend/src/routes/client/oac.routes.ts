import { Router } from "express";
import { ClientOACController } from "../../controllers/client/OACController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

// Get my requests
router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientOACController.listMy
);

// Submit new request
router.post(
  "/",
  authenticate,
  authorize("client"),
  ClientOACController.create
);

export default router;
