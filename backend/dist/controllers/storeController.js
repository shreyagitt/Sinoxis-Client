"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStoreController = void 0;
const Store_1 = __importDefault(require("../models/Store"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminStoreController = {
    /**
     * 🧾 List all stores
     * GET /api/v1/stores
     */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const data = await Store_1.default.find().sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({ success: true, data });
    }),
    /**
     * ➕ Create Store
     * POST /api/v1/stores
     */
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const file = req.file;
        let uploadResult;
        if (file) {
            uploadResult = await cloudinary_1.default.uploader.upload(file.path, {
                folder: "sinoxis/stores",
            });
            fs_1.default.unlinkSync(file.path);
        }
        const store = await Store_1.default.create({
            name: req.body.name,
            platform: req.body.platform,
            icon: uploadResult?.secure_url,
            iconId: uploadResult?.public_id,
        });
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Store created successfully",
            data: store,
        });
    }),
    /**
     * ✏ Update Store
     * PATCH /api/v1/stores/:id
     */
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const store = await Store_1.default.findById(req.params.id);
        if (!store) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Store not found",
            });
        }
        if (req.file) {
            await cloudinary_1.default.uploader.destroy(store.iconId);
            const upload = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "sinoxis/stores",
            });
            fs_1.default.unlinkSync(req.file.path);
            store.icon = upload.secure_url;
            store.iconId = upload.public_id;
        }
        store.name = req.body.name || store.name;
        store.platform = req.body.platform || store.platform;
        await store.save();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Store updated",
            data: store,
        });
    }),
    /**
     * 🔄 Toggle Store Active
     * PATCH /api/v1/stores/:id/toggle
     */
    toggleActive: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const store = await Store_1.default.findById(req.params.id);
        if (!store) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Store not found",
            });
        }
        store.isActive = !store.isActive;
        await store.save();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: `Store ${store.isActive ? "activated" : "deactivated"}`,
            data: store,
        });
    }),
    /**
     * ❌ Delete Store
     * DELETE /api/v1/stores/:id
     */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const store = await Store_1.default.findById(req.params.id);
        if (!store) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: "Store not found",
            });
        }
        await cloudinary_1.default.uploader.destroy(store.iconId);
        await store.deleteOne();
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            message: "Store deleted successfully",
        });
    }),
};
