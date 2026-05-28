"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const youTubeClaimController_1 = require("../controllers/youTubeClaimController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   YOUTUBE CLAIM ROUTES (ADMIN ONLY)
   ============================================================ */
// List all claims
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), youTubeClaimController_1.AdminYouTubeClaimController.list);
// Update claim status
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), youTubeClaimController_1.AdminYouTubeClaimController.updateStatus);
// Delete claim
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), youTubeClaimController_1.AdminYouTubeClaimController.delete);
exports.default = router;
