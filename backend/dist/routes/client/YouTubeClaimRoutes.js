"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const YouTubeClaimController_1 = require("../../controllers/client/YouTubeClaimController");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT YOUTUBE CLAIM ROUTES (CLIENT ONLY)
   ============================================================ */
// Submit a YouTube claim
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("youtubeClaimRelease"), upload.single("screenshot"), YouTubeClaimController_1.ClientYouTubeClaimController.submit);
// Get all claims of the logged-in client
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), YouTubeClaimController_1.ClientYouTubeClaimController.list);
exports.default = router;
