"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientArtistController = void 0;
const Artist_1 = __importDefault(require("../../models/Artist"));
const errorHandler_1 = require("../../middlewares/errorHandler");
const constants_1 = require("../../config/constants");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
exports.ClientArtistController = {
    // --------------------------------------------------
    // LIST ARTISTS (Search by name)
    // --------------------------------------------------
    list: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { search } = req.query;
        const filter = {};
        if (search) {
            filter.name = { $regex: new RegExp(search, "i") };
        }
        const artists = await Artist_1.default.find(filter).sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            success: true,
            data: artists,
            message: "Artists fetched successfully",
        });
    }),
    // --------------------------------------------------
    // GET SINGLE ARTIST
    // --------------------------------------------------
    getOne: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const artist = await Artist_1.default.findById(req.params.id);
        if (!artist) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Artist not found",
            });
        }
        res.json({
            success: true,
            data: artist,
            message: "Artist loaded",
        });
    }),
    // --------------------------------------------------
    // CREATE ARTIST
    // --------------------------------------------------
    create: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { name, mobile, email, spotify, apple, youtube, } = req.body;
        let avatar = "";
        let avatarId = "";
        // Cloudinary upload
        if (req.file) {
            const upload = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "artists",
            });
            avatar = upload.secure_url;
            avatarId = upload.public_id;
        }
        const artist = await Artist_1.default.create({
            name,
            mobile,
            email,
            spotify,
            apple,
            youtube,
            avatar,
            avatarId,
        });
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            success: true,
            data: artist,
            message: "Artist created successfully",
        });
    }),
    // --------------------------------------------------
    // UPDATE ARTIST
    // --------------------------------------------------
    update: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const artist = await Artist_1.default.findById(req.params.id);
        if (!artist) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Artist not found",
            });
        }
        // Replace image if a new file is uploaded
        if (req.file) {
            if (artist.avatarId) {
                try {
                    await cloudinary_1.default.uploader.destroy(artist.avatarId);
                }
                catch (err) {
                    console.log("Cloudinary deletion failed:", err);
                }
            }
            const upload = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "artists",
            });
            artist.avatar = upload.secure_url;
            artist.avatarId = upload.public_id;
        }
        // Update fields
        artist.name = req.body.name ?? artist.name;
        artist.mobile = req.body.mobile ?? artist.mobile;
        artist.email = req.body.email ?? artist.email;
        artist.spotify = req.body.spotify ?? artist.spotify;
        artist.apple = req.body.apple ?? artist.apple;
        artist.youtube = req.body.youtube ?? artist.youtube;
        await artist.save();
        res.json({
            success: true,
            data: artist,
            message: "Artist updated successfully",
        });
    }),
    // --------------------------------------------------
    // DELETE ARTIST
    // --------------------------------------------------
    delete: (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const artist = await Artist_1.default.findById(req.params.id);
        if (!artist) {
            return res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Artist not found",
            });
        }
        // Remove Cloudinary image if exists
        if (artist.avatarId) {
            try {
                await cloudinary_1.default.uploader.destroy(artist.avatarId);
            }
            catch (err) {
                console.log("Cloudinary deletion failed:", err);
            }
        }
        await artist.deleteOne();
        res.json({
            success: true,
            message: "Artist deleted successfully",
        });
    }),
};
