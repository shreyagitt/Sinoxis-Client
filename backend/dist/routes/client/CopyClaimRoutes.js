"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const CopyrightClaimController_1 = require("../../controllers/client/CopyrightClaimController");
const checkPermission_1 = require("../../middlewares/checkPermission");
const router = (0, express_1.Router)();
// Client can submit new claim
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("copyrightClaim"), CopyrightClaimController_1.ClientCopyrightClaimController.submit);
// Client can list only own claims
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), CopyrightClaimController_1.ClientCopyrightClaimController.list);
exports.default = router;
