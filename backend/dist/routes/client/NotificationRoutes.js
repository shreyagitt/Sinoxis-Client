"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const NotificationController_1 = require("../../controllers/client/NotificationController");
const router = (0, express_1.Router)();
// ✅ GET NOTIFICATIONS
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), NotificationController_1.getMyNotifications);
// ✅ DELETE SINGLE
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("client"), NotificationController_1.deleteNotification);
// ✅ MARK ALL READ
router.patch("/mark-all-read", auth_1.authenticate, (0, auth_1.authorize)("client"), NotificationController_1.markAllAsRead);
exports.default = router;
