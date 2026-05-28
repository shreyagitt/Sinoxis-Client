"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const YouTubeOACController_1 = require("../../controllers/client/YouTubeOACController");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT YOUTUBE OAC ROUTES (CLIENT ONLY)
   ============================================================ */
// Submit YouTube OAC Request
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("youtubeOACRequest"), YouTubeOACController_1.ClientYouTubeOACController.submit);
// Get all OAC requests for logged-in client
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), YouTubeOACController_1.ClientYouTubeOACController.list);
exports.default = router;
