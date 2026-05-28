"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientOACController = void 0;
const OACRequest_1 = __importDefault(require("../../models/OACRequest"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
exports.ClientOACController = {
    // --------------------------------------------------
    // LIST MY OAC REQUESTS
    // --------------------------------------------------
    listMy: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.userId;
        const requests = await OACRequest_1.default.find({ userId })
            .sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: requests,
            message: "OAC requests fetched successfully",
        });
    }),
    // --------------------------------------------------
    // SUBMIT OAC REQUEST
    // --------------------------------------------------
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.userId;
        const { ytChannel, topicChannel, artistName, songs } = req.body;
        if (!songs || songs.length < 3) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "You must add at least 3 songs",
            });
        }
        const request = await OACRequest_1.default.create({
            ytChannel,
            topicChannel,
            artistName,
            songs,
            userId,
        });
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            data: request,
            message: "OAC request submitted successfully",
        });
    }),
};
