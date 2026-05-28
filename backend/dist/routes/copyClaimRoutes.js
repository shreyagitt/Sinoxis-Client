"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const copyrightClaimController_1 = require("../controllers/copyrightClaimController");
const router = (0, express_1.Router)();
// Admin: View all claims
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), copyrightClaimController_1.AdminCopyrightClaimController.list);
// Admin: Update claim status
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), copyrightClaimController_1.AdminCopyrightClaimController.updateStatus);
// Admin: Delete claim
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), copyrightClaimController_1.AdminCopyrightClaimController.delete);
exports.default = router;
