import { Router } from "express";
import { AdminLabelController } from "../controllers/labelController";
import { authenticate, authorize } from "../middlewares/auth";
import upload from "../middlewares/uploadLabel";

const router = Router();

router.get("/", authenticate, authorize("admin"), AdminLabelController.list);
router.post(
  "/",
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
  ]),
  AdminLabelController.create
);
router.get("/:id", authenticate, authorize("admin"), AdminLabelController.getOne);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
  ]),
  AdminLabelController.update
);

router.delete("/:id", authenticate, authorize("admin"), AdminLabelController.delete);

export default router;
