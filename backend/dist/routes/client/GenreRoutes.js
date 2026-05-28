"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GenreController_1 = require("../../controllers/client/GenreController");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), GenreController_1.ClientGenreController.list);
exports.default = router;
