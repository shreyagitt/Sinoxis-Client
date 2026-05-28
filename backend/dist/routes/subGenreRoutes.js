"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subGenreController_1 = require("../controllers/subGenreController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   SUBGENRE ROUTES (ADMIN ONLY)
   ============================================================ */
/**
 * 📋 List subgenres for a genre
 * GET /api/v1/subgenres/genre/:genreId
 */
router.get("/genre/:genreId", auth_1.authenticate, (0, auth_1.authorize)("admin"), subGenreController_1.AdminSubGenreController.list);
/**
 * ➕ Create subgenre under a genre
 * POST /api/v1/subgenres/genre/:genreId
 */
router.post("/genre/:genreId", auth_1.authenticate, (0, auth_1.authorize)("admin"), subGenreController_1.AdminSubGenreController.create);
/**
 * ✏ Update subgenre
 * PATCH /api/v1/subgenres/:id
 */
router.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), subGenreController_1.AdminSubGenreController.update);
/**
 * 🔄 Toggle subgenre active
 * PATCH /api/v1/subgenres/:id/toggle
 */
router.patch("/:id/toggle", auth_1.authenticate, (0, auth_1.authorize)("admin"), subGenreController_1.AdminSubGenreController.toggleActive);
/**
 * ❌ Delete subgenre
 * DELETE /api/v1/subgenres/:id
 */
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), subGenreController_1.AdminSubGenreController.delete);
exports.default = router;
