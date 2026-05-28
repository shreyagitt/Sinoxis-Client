"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/* ============================================================
   ADMIN PAYMENT ROUTES
============================================================ */
// ✅ List all payment requests
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("admin"), paymentController_1.AdminPaymentController.listAll);
// ✅ Update request status (Paid / Failed)
router.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), paymentController_1.AdminPaymentController.updateStatus);
// ✅ Delete payment request
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), paymentController_1.AdminPaymentController.deleteRequest);
exports.default = router;
