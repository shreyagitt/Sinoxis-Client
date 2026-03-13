"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metadataController_1 = require("../controllers/metadataController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   METADATA ROUTES (ADMIN ONLY)
   ============================================================ */
// List metadata entries
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), metadataController_1.metadataController.list);
// Update metadata status
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), metadataController_1.metadataController.updateStatus);
// Delete metadata
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), metadataController_1.metadataController.delete);
exports.default = router;
