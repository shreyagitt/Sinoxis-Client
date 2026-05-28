"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OACController_1 = require("../../controllers/client/OACController");
const auth_1 = require("../../middlewares/auth");
const checkPermission_1 = require("../../middlewares/checkPermission");
const router = (0, express_1.Router)();
// Get my requests
router.get("/", auth_1.authenticate, (0, auth_1.authorize)("client"), OACController_1.ClientOACController.listMy);
// Submit new request
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("client"), (0, checkPermission_1.checkPermission)("officialArtistChannel"), OACController_1.ClientOACController.create);
exports.default = router;
