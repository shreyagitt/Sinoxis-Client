"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const MetadataController_1 = require("../../controllers/client/MetadataController");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT METADATA ROUTES (CLIENT ONLY)
   ============================================================ */
// Submit metadata
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("metadataUpdateRequest"), upload.single("artwork"), MetadataController_1.MetadataController.submit);
// Get client's metadata list
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), MetadataController_1.MetadataController.list);
exports.default = router;
