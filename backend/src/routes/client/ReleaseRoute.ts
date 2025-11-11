import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import upload from "../../middlewares/upload";
import { ClientReleaseController } from "../../controllers/client/ReleaseController";

const router = Router();

router.get("/", authenticate, ClientReleaseController.mine);
router.get("/:id", authenticate, ClientReleaseController.getOne);

router.post(
  "/",
  authenticate,
  upload.fields([{ name: "coverImage" }, { name: "audioFile" }]),
  ClientReleaseController.create
);

router.put(
  "/:id",
  authenticate,
  upload.fields([{ name: "coverImage" }, { name: "audioFile" }]),
  ClientReleaseController.update
);

export default router;
