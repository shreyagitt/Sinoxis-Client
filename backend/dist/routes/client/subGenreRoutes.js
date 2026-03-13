"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SubGenreController_1 = require("../../controllers/client/SubGenreController");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT SUBGENRE ROUTES
   ============================================================ */
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), SubGenreController_1.ClientSubGenreController.listAll);
router.get("/:genreId", auth_1.authenticate, (0, auth_1.authorize)("client"), SubGenreController_1.ClientSubGenreController.listByGenre);
exports.default = router;
