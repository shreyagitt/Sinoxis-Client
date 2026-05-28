"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const storeController_1 = require("../controllers/storeController");
const auth_1 = require("../middlewares/auth");
const upload = (0, multer_1.default)({ dest: "uploads/" });
const router = (0, express_1.Router)();
/* ============================================================
   STORE ROUTES (ADMIN ONLY)
   ============================================================ */
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), storeController_1.AdminStoreController.list);
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), upload.single("icon"), storeController_1.AdminStoreController.create);
router.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), upload.single("icon"), storeController_1.AdminStoreController.update);
router.patch("/:id/toggle", auth_1.authenticate, (0, auth_1.authorize)("admin"), storeController_1.AdminStoreController.toggleActive);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), storeController_1.AdminStoreController.delete);
exports.default = router;
