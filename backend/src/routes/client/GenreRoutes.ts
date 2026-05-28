import { Router } from "express";
import { ClientGenreController } from "../../controllers/client/GenreController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientGenreController.list
);

export default router;