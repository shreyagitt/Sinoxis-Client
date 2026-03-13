"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SocialISRCController_1 = require("../../controllers/client/SocialISRCController");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT SOCIAL ISRC ROUTES (CLIENT ONLY)
   ============================================================ */
// Submit new ISRC for a release
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("socialMediaLinks"), SocialISRCController_1.ClientSocialISRCController.submit);
// Get all ISRC submissions of the logged-in client
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), SocialISRCController_1.ClientSocialISRCController.list);
exports.default = router;
