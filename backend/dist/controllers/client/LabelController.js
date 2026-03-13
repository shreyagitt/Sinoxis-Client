"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientLabelController = void 0;
const Label_1 = __importDefault(require("../../models/Label"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
/* ----------------------------------------------------------
   Upload Helper (NO MIME VALIDATION HERE)
---------------------------------------------------------- */
const uploadToCloudinary = async (file) => {
    const result = await cloudinary_1.default.uploader.upload(file.path, {
        folder: "labels/aadhar",
        resource_type: "image",
    });
    // safely delete temp file
    if (fs_1.default.existsSync(file.path)) {
        fs_1.default.unlinkSync(file.path);
    }
    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
};
/* ----------------------------------------------------------
   Controller
---------------------------------------------------------- */
exports.ClientLabelController = {
    /* LIST */
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const labels = await Label_1.default.find({
            createdBy: req.user.userId,
        })
            .sort({ createdAt: -1 })
            .select("-__v");
        res.json({ success: true, data: labels });
    }),
    /* GET ONE */
    getOne: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const label = await Label_1.default.findOne({
            _id: req.params.id,
            createdBy: req.user.userId,
        });
        if (!label) {
            return res.status(404).json({
                success: false,
                message: "Label not found",
            });
        }
        res.json({ success: true, data: label });
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
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 5);
        const label = await Label_1.default.create({
            ...body,
            aadharFront,
            aadharFrontId,
            aadharBack,
            aadharBackId,
            createdBy: req.user.userId,
            expiry,
        });
        res.status(201).json({ success: true, data: label });
    }),
    /* UPDATE */
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const label = await Label_1.default.findOne({
            _id: req.params.id,
            createdBy: req.user.userId,
        });
        if (!label) {
            return res.status(404).json({
                success: false,
                message: "Label not found",
            });
        }
        const body = req.body;
        const files = req.files;
        if (files?.aadharFront?.[0]) {
            if (label.aadharFrontId) {
                await cloudinary_1.default.uploader.destroy(label.aadharFrontId);
            }
            const upload = await uploadToCloudinary(files.aadharFront[0]);
            body.aadharFront = upload.url;
            body.aadharFrontId = upload.publicId;
        }
        if (files?.aadharBack?.[0]) {
            if (label.aadharBackId) {
                await cloudinary_1.default.uploader.destroy(label.aadharBackId);
            }
            const upload = await uploadToCloudinary(files.aadharBack[0]);
            body.aadharBack = upload.url;
            body.aadharBackId = upload.publicId;
        }
        const updated = await Label_1.default.findByIdAndUpdate(label._id, body, {
            new: true,
        });
        res.json({ success: true, data: updated });
    }),
    /* DELETE */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const label = await Label_1.default.findOne({
            _id: req.params.id,
            createdBy: req.user.userId,
        });
        if (!label) {
            return res.status(404).json({
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
        res.json({
            success: true,
            message: "Label deleted successfully",
        });
    }),
};
