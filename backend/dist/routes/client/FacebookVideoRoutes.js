"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const FacebookVideoController_1 = require("../../controllers/client/FacebookVideoController");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT FACEBOOK VIDEO ROUTES (CLIENT ONLY)
   ============================================================ */
// Submit Facebook video proof
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("facebookClaimRelease"), upload.single("screenshotFb"), FacebookVideoController_1.FacebookVideoController.submit);
// List logged-in client's Facebook submissions
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), FacebookVideoController_1.FacebookVideoController.list);
exports.default = router;
