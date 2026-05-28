"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
/* ============================================================
   ADMIN USER ROUTES
   ============================================================ */
// ✅ CREATE CLIENT USER (ADD USER)
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), userController_1.userController.create);
// Get all users (for dashboard + table)
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), userController_1.userController.list);
// Get single user
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), userController_1.userController.getOne);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), userController_1.userController.update);
router.put("/:id/permissions", auth_1.authenticate, (0, auth_1.authorize)("admin"), userController_1.userController.updatePermissions);
// Delete user
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), userController_1.userController.delete);
router.patch("/:id/block", auth_1.authenticate, (0, auth_1.authorize)("admin"), userController_1.userController.block);
exports.default = router;
