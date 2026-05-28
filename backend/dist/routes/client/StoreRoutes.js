"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StoreController_1 = require("../../controllers/client/StoreController");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT STORE ROUTES (CLIENT ONLY)
   ============================================================ */
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), StoreController_1.ClientStoreController.list);
exports.default = router;
