"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facebookVideoController_1 = require("../controllers/facebookVideoController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   FACEBOOK VIDEO ROUTES (ADMIN ONLY)
   ============================================================ */
// List all Facebook videos
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), facebookVideoController_1.facebookVideoController.list);
// Update video status
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), facebookVideoController_1.facebookVideoController.updateStatus);
// Delete video
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), facebookVideoController_1.facebookVideoController.delete);
exports.default = router;
