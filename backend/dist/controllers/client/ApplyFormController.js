"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientApplicationController = void 0;
const ApplyForm_1 = __importDefault(require("../../models/ApplyForm"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientApplicationController = {
    /**
     * @route POST /api/v1/client/apply
     * @desc Submit a client application
     */
    submit: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const body = req.body;
        // Ensure releasedBefore is boolean
        if (typeof body.releasedBefore === "string") {
            body.releasedBefore = body.releasedBefore === "true";
        }
        const application = await ApplyForm_1.default.create(body);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Application submitted successfully",
            data: application,
        });
    }),
    /**
     * @route GET /api/v1/client/apply
     * @desc Get all submitted applications
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const applications = await ApplyForm_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            total: applications.length,
            data: applications,
        });
    }),
};
