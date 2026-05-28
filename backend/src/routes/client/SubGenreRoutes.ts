import { Router } from "express";
import { ClientSubGenreController } from "../../controllers/client/SubGenreController";
import { authenticate, authorize } from "../../middlewares/auth";

const router = Router();

/* ============================================================
   CLIENT SUBGENRE ROUTES
   ============================================================ */

router.get(
  "/",
  authenticate,
  authorize("client"),
  ClientSubGenreController.listAll
);

router.get(
  "/:genreId",
  authenticate,
  authorize("client"),
  ClientSubGenreController.listByGenre
);

export default router;