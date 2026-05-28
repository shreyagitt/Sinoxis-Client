"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ArtistController_1 = require("../../controllers/client/ArtistController");
const auth_1 = require("../../middlewares/auth");
const upload_1 = __importDefault(require("../../middlewares/upload"));
const checkPermission_1 = require("../../middlewares/checkPermission");
const router = (0, express_1.Router)();
/* ============================
   PUBLIC ROUTES
   ============================ */
// List artists (search)
router.get("/", auth_1.optionalAuth, ArtistController_1.ClientArtistController.list);
// Get single artist
router.get("/:id", auth_1.optionalAuth, ArtistController_1.ClientArtistController.getOne);
/* ============================
   PROTECTED ROUTES (CLIENT ROLE)
   ============================ */
// Create new artist
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("artists"), upload_1.default.single("avatar"), // UPDATED FIELD NAME
ArtistController_1.ClientArtistController.create);
// Update artist
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("artists"), upload_1.default.single("avatar"), // UPDATED FIELD NAME
ArtistController_1.ClientArtistController.update);
// Delete artist
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("artists"), ArtistController_1.ClientArtistController.delete);
exports.default = router;
