"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLabelController = void 0;
const Label_1 = __importDefault(require("../models/Label"));
const errorHandler_1 = require("../middlewares/errorHandler");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const constants_1 = require("../config/constants");
const fs_1 = __importDefault(require("fs"));
/* =====================================================
   HELPER: Upload to Cloudinary
===================================================== */
const uploadToCloudinary = async (file) => {
    const result = await cloudinary_1.default.uploader.upload(file.path, {
        folder: "labels/aadhar",
        resource_type: "image",
    });
    fs_1.default.unlinkSync(file.path); // remove temp file
    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
};
exports.AdminLabelController = {
    /* LIST */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const labels = await Label_1.default.find()
            .sort({ createdAt: -1 })
            .select("-__v");
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: labels,
            total: labels.length,
        });
    }),
    /* GET ONE */
    getOne: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const label = await Label_1.default.findById(req.params.id).select("-__v");
        if (!label) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Label not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: label,
        });
    }),
    /* CREATE */
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const body = req.body;
        const files = req.files;
        let aadharFront, aadharFrontId;
        let aadharBack, aadharBackId;
        if (files?.aadharFront?.[0]) {
            const upload = await uploadToCloudinary(files.aadharFront[0]);
            aadharFront = upload.url;
            aadharFrontId = upload.publicId;
        }
        if (files?.aadharBack?.[0]) {
            const upload = await uploadToCloudinary(files.aadharBack[0]);
            aadharBack = upload.url;
            aadharBackId = upload.publicId;
        }
        const label = await Label_1.default.create({
            ...body,
            createdBy: body.createdBy,
            aadharFront,
            aadharFrontId,
            aadharBack,
            aadharBackId,
        });
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Label created successfully",
            data: label,
        });
    }),
    /* UPDATE STATUS */
    updateStatus: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const ALLOWED_STATUS = ["Active", "Pending", "Rejected", "Inactive"];
        const { status } = req.body;
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value",
            });
        }
        const label = await Label_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!label) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Label not found",
            });
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: label,
        });
    }),
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const label = await Label_1.default.findById(req.params.id);
        if (!label) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Label not found",
            });
        }
        const body = req.body;
        const files = req.files;
        // Replace Aadhar Front
        if (files?.aadharFront?.[0]) {
            if (label.aadharFrontId) {
                await cloudinary_1.default.uploader.destroy(label.aadharFrontId);
            }
            const upload = await uploadToCloudinary(files.aadharFront[0]);
            body.aadharFront = upload.url;
            body.aadharFrontId = upload.publicId;
        }
        // Replace Aadhar Back
        if (files?.aadharBack?.[0]) {
            if (label.aadharBackId) {
                await cloudinary_1.default.uploader.destroy(label.aadharBackId);
            }
            const upload = await uploadToCloudinary(files.aadharBack[0]);
            body.aadharBack = upload.url;
            body.aadharBackId = upload.publicId;
        }
        const updated = await Label_1.default.findByIdAndUpdate(req.params.id, body, { new: true });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Label updated successfully",
            data: updated,
        });
    }),
    /* DELETE */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const label = await Label_1.default.findById(req.params.id);
        if (!label) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Label not found",
            });
        }
        if (label.aadharFrontId) {
            await cloudinary_1.default.uploader.destroy(label.aadharFrontId);
        }
        if (label.aadharBackId) {
            await cloudinary_1.default.uploader.destroy(label.aadharBackId);
        }
        await label.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Label deleted successfully",
        });
    }),
};
