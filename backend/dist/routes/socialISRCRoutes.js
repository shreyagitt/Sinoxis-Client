"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const socialISRCController_1 = require("../controllers/socialISRCController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   SOCIAL ISRC ROUTES (ADMIN ONLY)
   ============================================================ */
// List all ISRC data
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), socialISRCController_1.AdminSocialISRCController.list);
// Update ISRC status
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), socialISRCController_1.AdminSocialISRCController.updateStatus);
// Delete ISRC record
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), socialISRCController_1.AdminSocialISRCController.delete);
exports.default = router;
