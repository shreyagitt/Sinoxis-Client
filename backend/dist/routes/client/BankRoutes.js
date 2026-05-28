"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BankController_1 = require("../../controllers/client/BankController");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT BANK DETAILS ROUTES (CLIENT ONLY)
   ============================================================ */
// Add or update client bank details
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("bankDetails"), BankController_1.BankController.upsert);
// Get logged-in client's bank details
router.get("/me", auth_1.authenticate, (0, auth_1.authorize)("client"), BankController_1.BankController.getMyDetails);
exports.default = router;
