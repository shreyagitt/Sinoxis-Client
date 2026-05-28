"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientCopyrightClaimController = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const CopyrightClaim_1 = __importDefault(require("../../models/CopyrightClaim"));
const constants_1 = require("../../config/constants");
exports.ClientCopyrightClaimController = {
    // ⭐ Submit new copyright claim
    submit: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { platform, videoLink, notes } = req.body;
        const claim = await CopyrightClaim_1.default.create({
            userId: req.user.userId,
            platform,
            videoLink,
            notes,
        });
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Request submitted successfully",
            data: claim,
        });
    }),
    // ⭐ List all claims submitted by logged-in client
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const claims = await CopyrightClaim_1.default.find({
            userId: req.user.userId,
        }).sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: claims,
        });
    }),
};
