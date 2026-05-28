import { Router } from "express";
import multer from "multer";
import { AdminGenreController } from "../controllers/genreController";
import { authenticate, authorize } from "../middlewares/auth";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.get("/", authenticate, authorize("admin"), AdminGenreController.list);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("icon"),
  AdminGenreController.create
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("icon"),
  AdminGenreController.update
);

router.patch(
  "/:id/toggle",
  authenticate,
  authorize("admin"),
  AdminGenreController.toggleActive
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminGenreController.delete
);

export default router;