"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLanguageController = void 0;
const Language_1 = __importDefault(require("../models/Language"));
const errorHandler_1 = require("../middlewares/errorHandler");
const constants_1 = require("../config/constants");
exports.AdminLanguageController = {
    /* LIST */
    list: (0, errorHandler_1.asyncHandler)(async (_req, res) => {
        const languages = await Language_1.default.find().sort({ name: 1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: languages,
        });
    }),
    /* CREATE */
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const language = await Language_1.default.create({
            name: req.body.name,
        });
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: "Language created",
            data: language,
        });
    }),
    /* UPDATE */
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const language = await Language_1.default.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: "Language not found",
            });
        }
        language.name = req.body.name || language.name;
        await language.save();
        res.status(200).json({
            success: true,
            message: "Language updated",
            data: language,
        });
    }),
    /* TOGGLE */
    toggleActive: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const language = await Language_1.default.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: "Language not found",
            });
        }
        language.isActive = !language.isActive;
        await language.save();
        res.status(200).json({
            success: true,
            data: language,
        });
    }),
    /* DELETE */
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        await Language_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Language deleted",
        });
    }),
};
