"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApplyFormController_1 = require("../../controllers/client/ApplyFormController");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// PUBLIC — Anyone can submit form
router.post("/", ApplyFormController_1.ClientApplicationController.submit);
// PROTECTED — Only logged-in clients can view their own applications
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), ApplyFormController_1.ClientApplicationController.list);
exports.default = router;
