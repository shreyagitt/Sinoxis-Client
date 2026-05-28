"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const upload_1 = __importDefault(require("../../middlewares/upload"));
const ReleaseController_1 = require("../../controllers/client/ReleaseController");
const router = (0, express_1.Router)();
/* =====================================================
   CREATE OR UPDATE RELEASE (ONE API)
   Used by: Release / Tracks / Stores / Submission pages
   ===================================================== */
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("release"), upload_1.default.fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), ReleaseController_1.upsertRelease);
/* =====================================================
   GET SINGLE RELEASE (EDIT / VIEW / PREFILL)
   ===================================================== */
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)("client"), ReleaseController_1.getMyReleaseById);
/* =====================================================
   GET ALL MY RELEASES (DASHBOARD)
   ===================================================== */
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), ReleaseController_1.getMyReleases);
/* =====================================================
   DELETE RELEASE
   ===================================================== */
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("release"), ReleaseController_1.deleteMyRelease);
exports.default = router;
