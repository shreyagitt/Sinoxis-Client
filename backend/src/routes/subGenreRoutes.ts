import { Router } from "express";
import { AdminSubGenreController } from "../controllers/subGenreController";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

/* ============================================================
   SUBGENRE ROUTES (ADMIN ONLY)
   ============================================================ */

/**
 * 📋 List subgenres for a genre
 * GET /api/v1/subgenres/genre/:genreId
 */
router.get(
  "/genre/:genreId",
  authenticate,
  authorize("admin"),
  AdminSubGenreController.list
);

/**
 * ➕ Create subgenre under a genre
 * POST /api/v1/subgenres/genre/:genreId
 */
router.post(
  "/genre/:genreId",
  authenticate,
  authorize("admin"),
  AdminSubGenreController.create
);

/**
 * ✏ Update subgenre
 * PATCH /api/v1/subgenres/:id
 */
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminSubGenreController.update
);

/**
 * 🔄 Toggle subgenre active
 * PATCH /api/v1/subgenres/:id/toggle
 */
router.patch(
  "/:id/toggle",
  authenticate,
  authorize("admin"),
  AdminSubGenreController.toggleActive
);

/**
 * ❌ Delete subgenre
 * DELETE /api/v1/subgenres/:id
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AdminSubGenreController.delete
);

export default router;