"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const youTubeOACController_1 = require("../controllers/youTubeOACController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   YOUTUBE OAC ROUTES (ADMIN ONLY)
   ============================================================ */
// List all OAC requests
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), youTubeOACController_1.AdminYouTubeOACController.list);
// Update OAC status
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), youTubeOACController_1.AdminYouTubeOACController.updateStatus);
// Delete OAC request
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), youTubeOACController_1.AdminYouTubeOACController.delete);
exports.default = router;
