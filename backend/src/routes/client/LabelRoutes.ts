import { Router } from "express";
import { ClientLabelController } from "../../controllers/client/LabelController";
import { authenticate, authorize } from "../../middlewares/auth";
//import upload from "../../middlewares/upload";
import uploadLabel from "../../middlewares/uploadLabel";
import { checkPermission } from "../../middlewares/checkPermission";

const router = Router();

router.get("/", authenticate, authorize("client"), ClientLabelController.list);
router.get("/:id", authenticate, authorize("client"), ClientLabelController.getOne);

router.post(
  "/",
  authenticate,
  authorize("client"),
  checkPermission("labels"),
  uploadLabel.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
  ]),
  ClientLabelController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("client"),
  checkPermission("labels"),
  uploadLabel.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
  ]),
  ClientLabelController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("client"),
  checkPermission("labels"),
  ClientLabelController.delete
);

export default router;
