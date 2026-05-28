"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OACAdminController_1 = require("../controllers/OACAdminController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Admin: list all requests
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), OACAdminController_1.AdminOACController.list);
// Admin: update status
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), OACAdminController_1.AdminOACController.updateStatus);
exports.default = router;
