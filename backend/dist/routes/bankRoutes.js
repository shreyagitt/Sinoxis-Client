"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bankController_1 = require("../controllers/bankController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   BANK MANAGEMENT ROUTES (ADMIN ONLY)
   ============================================================ */
// Get all bank entries
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin", "superadmin"), bankController_1.bankController.list);
// Get single bank entry
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin", "superadmin"), bankController_1.bankController.getOne);
// Verify bank record (admin only)
router.put("/:id/verify", auth_1.authenticate, (0, auth_1.authorize)("admin", "superadmin"), bankController_1.bankController.verify);
// Delete bank record
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin", "superadmin"), bankController_1.bankController.delete);
exports.default = router;
