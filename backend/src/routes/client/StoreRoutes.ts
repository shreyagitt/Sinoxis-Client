import { Router } from "express";
import { ClientStoreController } from "../../controllers/client/StoreController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT STORE ROUTES (CLIENT ONLY)
   ============================================================ */

router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientStoreController.list
);

export default router;
