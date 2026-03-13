"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artistController_1 = require("../controllers/artistController");
const upload_1 = __importDefault(require("../middlewares/upload"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   ARTIST ROUTES (ADMIN ONLY)
   ============================================================ */
// Get all artists (search)
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), artistController_1.artistController.list);
// Get single artist
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), artistController_1.artistController.getOne);
// Create artist
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), upload_1.default.single("avatar"), // UPDATED FIELD NAME
artistController_1.artistController.create);
// Update artist
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), upload_1.default.single("avatar"), // UPDATED FIELD NAME
artistController_1.artistController.update);
// Delete artist
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), artistController_1.artistController.delete);
exports.default = router;
