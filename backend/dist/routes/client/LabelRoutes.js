"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LabelController_1 = require("../../controllers/client/LabelController");
const auth_1 = require("../../middlewares/auth");
//import upload from "../../middlewares/upload";
const uploadLabel_1 = __importDefault(require("../../middlewares/uploadLabel"));
const checkPermission_1 = require("../../middlewares/checkPermission");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), LabelController_1.ClientLabelController.list);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)("client"), LabelController_1.ClientLabelController.getOne);
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("labels"), uploadLabel_1.default.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
]), LabelController_1.ClientLabelController.create);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("labels"), uploadLabel_1.default.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
]), LabelController_1.ClientLabelController.update);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("labels"), LabelController_1.ClientLabelController.delete);
exports.default = router;
