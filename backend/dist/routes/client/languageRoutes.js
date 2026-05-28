"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LanguageController_1 = require("../../controllers/client/LanguageController");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), LanguageController_1.ClientLanguageController.list);
exports.default = router;
