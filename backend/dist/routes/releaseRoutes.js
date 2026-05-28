"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const releaseController_1 = require("../controllers/releaseController");
const router = (0, express_1.Router)();
/* ================= ADMIN ROUTES ================= */
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), releaseController_1.getAllReleases);
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), releaseController_1.updateReleaseStatus);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), releaseController_1.deleteReleaseByAdmin);
exports.default = router;
