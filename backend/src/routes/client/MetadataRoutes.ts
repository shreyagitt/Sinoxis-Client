import { Router } from "express";
import multer from "multer";
import { MetadataController } from "../../controllers/client/MetadataController";
import { authenticate, authorize } from "../../middlewares/auth";
import { checkPermission } from "../../middlewares/checkPermission";

const upload = multer({ dest: "uploads/" });
const router = Router();

/* ============================================================
   CLIENT METADATA ROUTES (CLIENT ONLY)
   ============================================================ */

// Submit metadata
router.post(
  "/",
  authenticate,
  authorize("client"),
  checkPermission("metadataUpdateRequest"),
  upload.single("artwork"),
  MetadataController.submit
);

// Get client's metadata list
router.get(
  "/",
  authenticate,
  authorize("client"),
  MetadataController.list
);

export default router;

