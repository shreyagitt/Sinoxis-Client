"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_1 = require("../../controllers/client/PaymentController");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const router = (0, express_1.Router)();
/* ============================================================
   CLIENT PAYMENT ROUTES
============================================================ */
// ✅ Create payment request
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("requestPayment"), PaymentController_1.ClientPaymentController.create);
// ✅ List user's own payment requests
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), PaymentController_1.ClientPaymentController.listMyRequests);
exports.default = router;
