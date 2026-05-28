"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const labelController_1 = require("../controllers/labelController");
const auth_1 = require("../middlewares/auth");
const uploadLabel_1 = __importDefault(require("../middlewares/uploadLabel"));
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), labelController_1.AdminLabelController.list);
router.post("/", uploadLabel_1.default.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
]), labelController_1.AdminLabelController.create);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), labelController_1.AdminLabelController.getOne);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), uploadLabel_1.default.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
]), labelController_1.AdminLabelController.update);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), labelController_1.AdminLabelController.delete);
exports.default = router;
