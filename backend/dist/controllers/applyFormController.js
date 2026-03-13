"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminApplicationController = void 0;
const ApplyForm_1 = __importDefault(require("../models/ApplyForm"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminApplicationController = {
    /**
     * @route GET /api/v1/applications
     * @desc Admin — list all submitted applications
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const applications = await ApplyForm_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            total: applications.length,
            data: applications,
        });
    }),
    /**
     * @route POST /api/v1/applications
     * @desc Admin — create a new application manually (if needed)
     */
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { fullName, artistName, email, phone, instagram, youtube, labelName, releasedBefore, heardAbout, } = req.body;
        // 🛑 Basic validation
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                status: false,
                message: "Full name, email, and phone are required.",
            });
        }
        // Ensure boolean
        const releasedBeforeBool = typeof releasedBefore === "string"
            ? releasedBefore === "true"
            : Boolean(releasedBefore);
        const newApplication = await ApplyForm_1.default.create({
            fullName,
            artistName,
            email,
            phone,
            instagram,
            youtube,
            labelName,
            releasedBefore: releasedBeforeBool,
            heardAbout,
        });
        return res.status(constants_1.HTTP_STATUS.CREATED).json({
            status: true,
            message: "Application created successfully",
            data: newApplication,
        });
    }),
    /**
     * @route PATCH /api/v1/applications/:id/status
     * @desc Admin — update status (Reviewed, Accepted, Rejected)
     */
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { status } = req.body;
        const allowed = ["Pending", "Approved", "Rejected"];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value.",
            });
        }
        const updated = await ApplyForm_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Application status updated",
            data: updated,
        });
    }),
    /**
     * @route DELETE /api/v1/applications/:id
     * @desc Admin — delete application
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        await ApplyForm_1.default.findByIdAndDelete(req.params.id);
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Application deleted successfully",
        });
    }),
};
