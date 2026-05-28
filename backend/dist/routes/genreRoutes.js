"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const genreController_1 = require("../controllers/genreController");
const auth_1 = require("../middlewares/auth");
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), genreController_1.AdminGenreController.list);
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), upload.single("icon"), genreController_1.AdminGenreController.create);
router.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), upload.single("icon"), genreController_1.AdminGenreController.update);
router.patch("/:id/toggle", auth_1.authenticate, (0, auth_1.authorize)("admin"), genreController_1.AdminGenreController.toggleActive);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), genreController_1.AdminGenreController.delete);
exports.default = router;
