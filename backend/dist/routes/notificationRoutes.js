"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/notificationRoutes.ts
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router.post("/send", auth_1.authenticate, (0, auth_1.authorize)("admin"), notificationController_1.sendNotification);
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), notificationController_1.getAllNotifications);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), notificationController_1.deleteNotification);
exports.default = router;
