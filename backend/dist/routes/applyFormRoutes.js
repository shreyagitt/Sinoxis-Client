"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applyFormController_1 = require("../controllers/applyFormController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// ======================================================
// ADMIN ROUTES (Protected by RBAC)
// ======================================================
// Get all applications (ADMIN ONLY)
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), applyFormController_1.AdminApplicationController.list);
// Create new applicant (ADMIN ONLY)
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), applyFormController_1.AdminApplicationController.create);
// Update applicant status (ADMIN ONLY)
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorize)("admin"), applyFormController_1.AdminApplicationController.updateStatus);
// Delete applicant (ADMIN ONLY)
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), applyFormController_1.AdminApplicationController.delete);
exports.default = router;
